// Plantilla de prompt para formato debate (2+ personas con posiciones opuestas)
// Genera argumentos, contraargumentos y moderacion

import type { VoiceInfo } from "./index"

interface DebatePromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
  voices?: VoiceInfo[]
}

export function getDebatePrompt(params: DebatePromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext, voices } = params

  const estimatedBlocks = Math.max(12, Math.round(duration * 7))
  const hasExplicitModerator = numberOfVoices >= 3

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a structured but lively debate between speakers who hold different positions on the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF SPEAKERS: ${numberOfVoices} (use voiceIndex 0 to ${numberOfVoices - 1})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

VOICE ASSIGNMENT:
${voices && voices.length > 0
    ? voices.map((v, i) => `- voiceIndex ${i}: "${v.name}" (${v.gender === "female" ? "FEMALE voice — write dialogue appropriate for a woman" : "MALE voice — write dialogue appropriate for a man"}${v.role ? `, role: ${v.role}` : ""})`).join("\n")
    : hasExplicitModerator
      ? `- voiceIndex 0: the moderator\n- voiceIndex 1 to ${numberOfVoices - 1}: debaters with distinct positions`
      : `- voiceIndex 0 and ${numberOfVoices > 1 ? `voiceIndex 1` : "the same speaker presenting both sides"}: represent opposing positions`}

CRITICAL: You MUST use the exact names provided above for each voiceIndex. Each speaker's dialogue must match their assigned gender — do NOT invent new names or swap genders.

DEBATE GUIDELINES:
${hasExplicitModerator
    ? `- voiceIndex 0 is the MODERATOR: introduces the topic, manages turns, asks probing questions, keeps the debate on track, and summarizes points
- voiceIndex 1 to ${numberOfVoices - 1} are DEBATERS: each defends a distinct position`
    : `- voiceIndex 0 and ${numberOfVoices > 1 ? `voiceIndex 1` : "the same speaker presenting both sides"}: represent opposing positions, taking turns to moderate themselves`}
- Each debater must present well-reasoned arguments supported by evidence or logic
- Include direct rebuttals: speakers should address and counter specific points made by opponents
- Allow moments of concession where a speaker acknowledges a valid point from the other side
- Build intensity gradually: start civil, increase passion as the debate deepens
- Avoid strawman arguments; each position should be represented fairly and intelligently
- Include at least one moment where a speaker reframes the debate or introduces an unexpected angle

DEBATE STRUCTURE:
- "intro" segment: ${hasExplicitModerator ? "moderator introduces the topic, the question at hand, and the speakers" : "speakers introduce themselves and the opposing positions"}
- "main" segment(s): structured rounds of argumentation
  - Opening statements from each side
  - Direct rebuttals and counterarguments
  - Cross-examination or challenging questions
  - Deeper exploration of the strongest points
- "outro" segment: ${hasExplicitModerator ? "moderator summarizes both positions and key takeaways" : "speakers offer final statements and find common ground or agree to disagree"}

Aim for approximately ${estimatedBlocks} dialogue blocks total across all segments.

EMOTION USAGE:
Use these emotions to reflect the debate dynamics:
- "neutral": presenting facts, stating positions calmly
- "happy": when landing a strong point or finding common ground
- "serious": for heavyweight arguments or critical evidence
- "excited": for passionate defenses or breakthrough moments
- "thoughtful": for concessions, nuanced points, or reflective responses

NATURALNESS & RHYTHM (very important for audio quality):
- Use punctuation to control pacing: ellipsis (…) for trailing thoughts, em dashes (—) for abrupt shifts, commas for brief pauses
- Include natural interjections and filler phrases: "bueno", "a ver", "mira", "oye", "pues", "claro", "vale" (adapt to ${language})
- Vary sentence length: mix short punchy rebuttals with longer reasoned arguments
- Add "pauseAfterMs" values to control silence between turns: use 300-500ms for quick exchanges, 600-1000ms after dramatic points or strong arguments, 200ms for rapid back-and-forth
- Avoid overly formal or written-style language; use spoken register appropriate for a debate podcast
- Include occasional self-corrections or restarts: "Es decir..." / "O sea..." / "Lo que quiero decir es..."

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
          "text": "string - what this speaker says",
          "emotion": "neutral" | "happy" | "serious" | "excited" | "thoughtful",
          "pauseAfterMs": number (optional, 200-1000 — silence after this block)
        }
      ]
    }
  ]
}

Write the entire script in ${language}. Make it feel like a real intellectual debate, not a rehearsed script. Prioritize spoken rhythm and natural flow over perfect grammar.`
}
