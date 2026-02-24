import { generateSpeech } from "@/lib/elevenlabs"
import type { PodcastScript, PodcastConfig, ScriptBlock } from "@/types"

// Default ElevenLabs voice ID (Rachel - a clear, neutral voice)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

// Maximum concurrent speech synthesis requests
// Set to 1 for Free Tier ElevenLabs (max 2 concurrent, minus 1 for safety)
const CONCURRENCY_LIMIT = 1

/**
 * Simple semaphore for limiting concurrent async operations.
 */
class Semaphore {
  private queue: (() => void)[] = []
  private active = 0

  constructor(private limit: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.limit) {
      this.active++
      return
    }

    return new Promise<void>((resolve) => {
      this.queue.push(() => {
        this.active++
        resolve()
      })
    })
  }

  release(): void {
    this.active--
    const next = this.queue.shift()
    if (next) {
      next()
    }
  }
}

/**
 * Resolves the ElevenLabs voice ID for a given script block.
 * Falls back to default voice if no matching voice is found in config.
 */
function resolveVoiceId(block: ScriptBlock, config: PodcastConfig): string {
  // Try to find the voice in config by voiceId
  const configVoice = config.voices.find((v) => v.voiceId === block.voiceId)
  if (configVoice && configVoice.voiceId && configVoice.voiceId !== "default") {
    return configVoice.voiceId
  }

  // Fall back to the first voice in config, or the default
  if (config.voices.length > 0 && config.voices[0].voiceId && config.voices[0].voiceId !== "default") {
    return config.voices[0].voiceId
  }

  return DEFAULT_VOICE_ID
}

/**
 * Extracts all text blocks from the script in order.
 */
function extractBlocks(script: PodcastScript): ScriptBlock[] {
  const blocks: ScriptBlock[] = []
  for (const segment of script.segments) {
    for (const block of segment.blocks) {
      // Skip empty or whitespace-only blocks
      if (block.text.trim()) {
        blocks.push(block)
      }
    }
  }
  return blocks
}

/**
 * Synthesizes all script blocks into audio buffers using ElevenLabs TTS.
 * Processes blocks in parallel with a concurrency limit.
 * Returns an array of audio Buffers in the same order as the script blocks.
 */
export async function synthesizeAudio(
  script: PodcastScript,
  config: PodcastConfig
): Promise<Buffer[]> {
  const blocks = extractBlocks(script)

  if (blocks.length === 0) {
    throw new Error("No text blocks found in script to synthesize")
  }

  const semaphore = new Semaphore(CONCURRENCY_LIMIT)
  const results: (Buffer | Error)[] = new Array(blocks.length)

  // Process all blocks in parallel with concurrency control
  const promises = blocks.map(async (block, index) => {
    await semaphore.acquire()

    try {
      const voiceId = resolveVoiceId(block, config)

      // Find the voice config for speed settings
      const voiceConfig = config.voices.find((v) => v.voiceId === block.voiceId)
      const speed = voiceConfig?.speed ?? 1.0

      const buffer = await generateSpeech({
        text: block.text,
        voiceId,
        speed,
      })

      results[index] = buffer
    } catch (error) {
      console.error(`[voice] Failed to synthesize block ${index}:`, error)
      results[index] = error instanceof Error ? error : new Error(String(error))
    } finally {
      semaphore.release()
    }
  })

  await Promise.all(promises)

  // Check for errors and collect successful buffers
  const audioBuffers: Buffer[] = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result instanceof Error) {
      throw new Error(`Audio synthesis failed for block ${i}: ${result.message}`)
    }
    audioBuffers.push(result)
  }

  return audioBuffers
}
