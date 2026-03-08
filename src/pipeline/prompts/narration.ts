// Plantilla de prompt para formato narracion (estilo documental/storytelling)
// Genera una narrativa inmersiva con ritmo dramatico

import type { VoiceInfo } from "./index"

interface NarrationPromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
  voices?: VoiceInfo[]
}

export function getNarrationPrompt(params: NarrationPromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext, voices } = params

  const estimatedBlocks = Math.max(8, Math.round(duration * 4))

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a documentary-style narration episode that tells a compelling story about the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF VOICES: ${numberOfVoices} (use voiceIndex 0 to ${numberOfVoices - 1})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

VOICE ASSIGNMENT:
${voices && voices.length > 0
    ? voices.map((v, i) => `- voiceIndex ${i}: "${v.name}" (${v.gender === "female" ? "FEMALE voice — write dialogue appropriate for a woman" : "MALE voice — write dialogue appropriate for a man"}${v.role ? `, role: ${v.role}` : ""})`).join("\n")
    : `- voiceIndex 0: the primary narrator` + (numberOfVoices > 1 ? `\n` + Array.from({length: numberOfVoices - 1}, (_, i) => `- voiceIndex ${i + 1}: secondary narrator/character ${i + 1}`).join("\n") : "")}

CRITICAL: You MUST use the exact names provided above for each voiceIndex. Each speaker's dialogue must match their assigned gender — do NOT invent new names or swap genders.

NARRATION GUIDELINES:
- voiceIndex 0 is the PRIMARY NARRATOR: drives the story forward with rich, descriptive language
${numberOfVoices > 1 ? `- voiceIndex 1 to ${numberOfVoices - 1}: secondary narrators, witnesses, or characters who provide quotes, testimonies, or alternative perspectives` : ""}
- Write in a cinematic, immersive style — the listener should feel transported
- Use vivid sensory descriptions: sights, sounds, textures, atmospheres
- Build narrative tension: start with a hook, develop through rising action, reach a climax or revelation
- Employ dramatic pacing: slow reflective passages contrasted with faster, intense sections
- Include scene-setting moments ("Imagine this..." or "Picture a...")
- Weave facts and data naturally into the narrative without breaking the storytelling flow
- Use the power of silence and pauses (short sentences for dramatic effect)

NARRATIVE STRUCTURE:
- "intro" segment: open with a powerful hook — a scene, a question, or a striking moment that grabs attention immediately
- "main" segment(s): develop the story in acts
  - Act 1: Set the scene, introduce the context and stakes
  - Act 2: Explore the core of the story with rising tension, key events, and discoveries
  - Act 3: Reach the turning point or revelation
- "outro" segment: resolve the narrative, deliver the final message, and leave the listener with a lasting impression

Aim for approximately ${estimatedBlocks} blocks total across all segments.

EMOTION USAGE:
Use emotions to guide the narrative delivery:
- "neutral": standard narration and scene-setting
- "happy": moments of triumph, beauty, or hope
- "serious": gravity, danger, or critical turning points
- "excited": discoveries, revelations, or action-packed moments
- "thoughtful": reflection, contemplation, or philosophical observations

NATURALNESS & RHYTHM (very important for audio quality):
- Use punctuation to control pacing: ellipsis (…) for trailing thoughts, em dashes (—) for abrupt shifts, periods for dramatic stops
- Vary sentence length dramatically: short punchy sentences for impact ("Y entonces… todo cambió."), longer flowing prose for scene-setting
- Add "pauseAfterMs" values to control silence between blocks: use 600-1000ms for dramatic pauses between scenes, 300-500ms for normal transitions, 1000-1500ms before major reveals
- Use the power of rhythm: build momentum with shorter sentences, then release with a long, descriptive passage
- Avoid overly formal or written-style language; use spoken register that feels cinematic yet human

You MUST respond with valid JSON only, no text before or after. Use this exact structure:

{
  "title": "string - a compelling episode title in ${language}",
  "description": "string - a brief episode description (2-3 sentences) in ${language}",
  "segments": [
    {
      "type": "intro" | "main" | "outro",
      "blocks": [
        {
          "voiceIndex": 0,
          "text": "string - the narration text",
          "emotion": "neutral" | "happy" | "serious" | "excited" | "thoughtful",
          "pauseAfterMs": number (optional, 200-1500 — silence after this block)
        }
      ]
    }
  ]
}

Write the entire script in ${language}. Make it sound like a world-class documentary narrator — captivating, authoritative, and deeply human. Prioritize spoken rhythm and dramatic pacing.`
}
