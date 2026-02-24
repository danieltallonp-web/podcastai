import { anthropic } from "@/lib/anthropic"
import type { PodcastConfig, PodcastScript, ScriptSegment, ScriptBlock } from "@/types"
import { promptGenerators } from "./prompts"

// Mapping from PodcastFormat to prompt generator
// Uses the promptGenerators map for dynamic format lookup
// INTERVIEW and INTERACTIVE fall back to conversation (no dedicated template)
function getPromptForConfig(config: PodcastConfig, researchContext: string): string {
  const baseParams = {
    topic: config.prompt,
    duration: config.duration,
    tone: config.tone.join(", "),
    language: config.language,
    numberOfVoices: config.voices.length || 1,
    researchContext: researchContext || undefined,
  }

  const key = config.format.toLowerCase()
  const generator = promptGenerators[key] ?? promptGenerators.conversation
  return generator(baseParams)
}

/**
 * Raw script structure returned from Claude's JSON response.
 * Uses voiceIndex instead of voiceId/voiceName since the LLM
 * doesn't know the actual voice IDs.
 */
interface RawScriptBlock {
  voiceIndex: number
  text: string
  emotion?: string
}

interface RawScriptSegment {
  type: string
  blocks: RawScriptBlock[]
  music?: string
  musicVolume?: number
}

interface RawScript {
  title: string
  description: string
  segments: RawScriptSegment[]
}

/**
 * Maps raw script blocks (with voiceIndex) to typed ScriptBlocks (with voiceId/voiceName).
 */
function mapRawScriptToTyped(raw: RawScript, config: PodcastConfig): PodcastScript {
  const voices = config.voices.length > 0
    ? config.voices
    : [{ voiceId: "default", name: "Narrator" }]

  const segments: ScriptSegment[] = raw.segments.map((seg) => {
    // Map raw segment type to our known types
    const validTypes = ["intro", "conversation", "narration", "outro", "transition"] as const
    type SegmentType = typeof validTypes[number]
    let segType: SegmentType = "narration"
    if (seg.type === "intro") segType = "intro"
    else if (seg.type === "outro") segType = "outro"
    else if (seg.type === "transition") segType = "transition"
    else if (seg.type === "main" || seg.type === "conversation") {
      segType = config.format === "MONOLOGUE" || config.format === "CLASS" || config.format === "NARRATION"
        ? "narration"
        : "conversation"
    }

    const blocks: ScriptBlock[] = seg.blocks.map((block) => {
      const voiceIndex = Math.max(0, Math.min(block.voiceIndex, voices.length - 1))
      const voice = voices[voiceIndex]

      return {
        voiceId: voice.voiceId,
        voiceName: voice.name,
        text: block.text,
        emotion: block.emotion,
      }
    })

    return {
      type: segType,
      music: seg.music || config.music,
      musicVolume: seg.musicVolume ?? config.musicVolume,
      blocks,
    }
  })

  // Estimate duration: roughly 150 words per minute for speech
  const totalWords = segments.reduce(
    (sum, seg) => sum + seg.blocks.reduce((bSum, b) => bSum + b.text.split(/\s+/).length, 0),
    0
  )
  const estimatedDuration = Math.round((totalWords / 150) * 60)

  return {
    title: raw.title,
    description: raw.description,
    estimatedDuration,
    segments,
  }
}

/**
 * Generates a podcast script using Claude based on the config and research context.
 */
export async function generateScript(
  config: PodcastConfig,
  researchContext: string
): Promise<PodcastScript> {
  const prompt = getPromptForConfig(config, researchContext)

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    // Extract text content from the response
    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in Claude response")
    }

    const rawText = textBlock.text.trim()

    // Try to parse JSON from the response
    // Claude sometimes wraps JSON in markdown code blocks
    let jsonString = rawText
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim()
    }

    let rawScript: RawScript
    try {
      rawScript = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("[script] Failed to parse Claude response as JSON:", parseError)
      console.error("[script] Raw response:", rawText.slice(0, 500))
      throw new Error("Failed to parse script JSON from Claude response")
    }

    // Validate basic structure
    if (!rawScript.title || !rawScript.segments || !Array.isArray(rawScript.segments)) {
      throw new Error("Invalid script structure: missing title or segments")
    }

    if (rawScript.segments.length === 0) {
      throw new Error("Invalid script structure: no segments generated")
    }

    // Map raw script to our typed format
    const script = mapRawScriptToTyped(rawScript, config)

    return script
  } catch (error) {
    console.error("[script] Script generation failed:", error)
    throw error
  }
}
