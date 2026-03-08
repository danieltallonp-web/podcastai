import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"

const globalForElevenLabs = globalThis as unknown as {
  elevenlabs: ElevenLabsClient | undefined
}

export const elevenlabs =
  globalForElevenLabs.elevenlabs ??
  new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY!,
  })

if (process.env.NODE_ENV !== "production") globalForElevenLabs.elevenlabs = elevenlabs

// Helper: List available voices
export async function listVoices() {
  const response = await elevenlabs.voices.getAll()
  return response.voices.map((voice) => ({
    id: voice.voiceId,
    name: voice.name,
    previewUrl: voice.previewUrl,
    category: voice.category,
    labels: voice.labels,
    description: voice.description,
  }))
}

// Helper: Generate speech from text
export async function generateSpeech(params: {
  text: string
  voiceId: string
  modelId?: string
  stability?: number
  similarityBoost?: number
  style?: number
  speed?: number
}) {
  const {
    text,
    voiceId,
    modelId = "eleven_multilingual_v2",
    stability = 0.35,
    similarityBoost = 0.75,
    style = 0.4,
    speed = 1.0,
  } = params

  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId,
    voiceSettings: {
      stability,
      similarityBoost,
      style,
      speed,
    },
  })

  // Convert ReadableStream to Buffer
  const chunks: Uint8Array[] = []
  const reader = audio.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }

  return Buffer.concat(chunks)
}
