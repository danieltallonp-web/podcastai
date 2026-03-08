// Plantilla de prompt para formato conversacional (2+ personas)
// Genera un dialogo natural con intercambios, reacciones y dinamismo

import type { VoiceInfo } from "./index"

interface ConversationPromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
  voices?: VoiceInfo[]
}

export function getConversationPrompt(params: ConversationPromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext, voices } = params

  // Estimacion aproximada de bloques segun duracion en minutos
  const estimatedBlocks = Math.max(10, Math.round(duration * 6))

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a natural, engaging conversation between ${numberOfVoices} speakers discussing the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF SPEAKERS: ${numberOfVoices} (use voiceIndex 0 to ${numberOfVoices - 1})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

CONVERSATION GUIDELINES:
- Create authentic back-and-forth dialogue where speakers build on each other's points
- Include natural reactions: "That's interesting because...", "I hadn't thought about it that way...", "Wait, but what about..."
- Speakers should sometimes agree, sometimes politely disagree, and occasionally be surprised
- Each speaker should have a distinct perspective or angle on the topic
- Include moments where speakers ask each other genuine questions
- Vary the length of interventions: some short reactions, some longer explanations
- Add conversational fillers sparingly for realism without overdoing it
- Build the conversation to reach meaningful insights or conclusions by the end

STRUCTURE:
- "intro" segment: speakers greet the audience and introduce the topic naturally
- "main" segment(s): the core conversation with natural flow and topic exploration
- "outro" segment: speakers summarize key takeaways and close the episode

Aim for approximately ${estimatedBlocks} dialogue blocks total across all segments.

VOICE ASSIGNMENT:
${voices && voices.length > 0
    ? voices.map((v, i) => `- voiceIndex ${i}: "${v.name}" (${v.gender === "female" ? "FEMALE voice — write dialogue appropriate for a woman" : "MALE voice — write dialogue appropriate for a man"}${v.role ? `, role: ${v.role}` : ""})`).join("\n")
    : `- voiceIndex 0: the host or primary conversation driver\n- voiceIndex 1 to ${numberOfVoices - 1}: co-hosts or guests with their own viewpoints`}

CRITICAL: You MUST use the exact names provided above for each voiceIndex. Each speaker's dialogue must match their assigned gender — do NOT invent new names or swap genders.

EMOTION USAGE:
Use these emotions to convey the right delivery tone for each block:
- "neutral": standard conversational delivery
- "happy": when sharing positive insights or agreeing enthusiastically
- "serious": for important points or sobering facts
- "excited": for surprising discoveries or passionate moments
- "thoughtful": for reflective or nuanced observations

NATURALNESS & RHYTHM (very important for audio quality):
- Use punctuation to control pacing: ellipsis (…) for trailing thoughts, em dashes (—) for abrupt shifts, commas for brief pauses
- Include natural interjections and filler phrases: "bueno", "a ver", "mira", "oye", "pues", "claro", "vale" (adapt to ${language})
- Vary sentence length: mix short punchy reactions with longer explanations
- Add "pauseAfterMs" values to control silence between turns: use 300-500ms for quick exchanges, 600-1000ms after questions or dramatic points, 200ms for rapid back-and-forth
- Avoid overly formal or written-style language; use spoken register appropriate for a podcast
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

Write the entire script in ${language}. Make it sound like a real, spontaneous conversation — NOT a scripted reading. Prioritize spoken rhythm and natural flow over perfect grammar.`
}
