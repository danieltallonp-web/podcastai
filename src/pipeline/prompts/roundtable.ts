// Plantilla de prompt para formato mesa redonda (panel con 3+ participantes)
// Genera una discusion de panel con multiples perspectivas

import type { VoiceInfo } from "./index"

interface RoundtablePromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
  voices?: VoiceInfo[]
}

export function getRoundtablePrompt(params: RoundtablePromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext, voices } = params

  // Mesa redonda necesita al menos 3 voces idealmente
  const effectiveVoices = Math.max(3, numberOfVoices)
  const estimatedBlocks = Math.max(14, Math.round(duration * 7))

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a roundtable panel discussion with ${effectiveVoices} speakers offering diverse perspectives on the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF SPEAKERS: ${effectiveVoices} (use voiceIndex 0 to ${effectiveVoices - 1})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

VOICE ASSIGNMENT:
${voices && voices.length > 0
    ? voices.map((v, i) => `- voiceIndex ${i}: "${v.name}" (${v.gender === "female" ? "FEMALE voice — write dialogue appropriate for a woman" : "MALE voice — write dialogue appropriate for a man"}${v.role ? `, role: ${v.role}` : ""})`).join("\n")
    : `- voiceIndex 0: the moderator/host\n` + Array.from({length: effectiveVoices - 1}, (_, i) => `- voiceIndex ${i + 1}: panelist ${i + 1}`).join("\n")}

CRITICAL: You MUST use the exact names provided above for each voiceIndex. Each speaker's dialogue must match their assigned gender — do NOT invent new names or swap genders.

ROUNDTABLE GUIDELINES:
- voiceIndex 0 is the MODERATOR/HOST: guides the discussion, introduces subtopics, ensures everyone speaks, asks follow-up questions, and bridges between different viewpoints
- voiceIndex 1 to ${effectiveVoices - 1} are PANELISTS: each brings a unique professional background, expertise, or worldview to the discussion
- Every panelist should have a clearly distinct perspective (e.g., technical vs. humanistic, optimistic vs. cautious, academic vs. practitioner)
- The moderator should draw out quiet panelists and prevent any single voice from dominating
- Include moments where panelists directly respond to each other, not just the moderator
- Allow organic tangents that the moderator gently steers back on track
- Include at least one moment of genuine surprise or new insight that emerges from the group dynamic
- Panelists should reference and build on points made by other panelists
- Create a sense of collective exploration rather than isolated opinions

PANEL STRUCTURE:
- "intro" segment: moderator welcomes the audience, introduces the topic and its relevance, then briefly introduces each panelist and their angle
- "main" segment(s): structured discussion rounds
  - Round 1: Each panelist shares their initial take on the topic (opening statements)
  - Round 2: The moderator poses a provocative question; panelists react and discuss among themselves
  - Round 3: Deeper dive — panelists challenge each other's positions and explore nuances
  - Round 4: Future outlook or practical implications — what does this mean going forward?
- "outro" segment: moderator asks each panelist for their single most important takeaway, then closes the episode

Aim for approximately ${estimatedBlocks} dialogue blocks total across all segments.

VOICE DISTRIBUTION:
- Moderator (voiceIndex 0): ~20% of total blocks — guiding, not dominating
- Panelists: distribute the remaining ~80% roughly equally among them
- Ensure no panelist is silent for too long

EMOTION USAGE:
Use emotions to reflect the panel dynamic:
- "neutral": presenting viewpoints calmly, stating facts
- "happy": agreement, shared enthusiasm, or celebrating a good point
- "serious": addressing risks, concerns, or weighty implications
- "excited": when a new idea emerges or the discussion hits a breakthrough
- "thoughtful": when synthesizing multiple viewpoints or offering nuanced takes

NATURALNESS & RHYTHM (very important for audio quality):
- Use punctuation to control pacing: ellipsis (…) for trailing thoughts, em dashes (—) for abrupt shifts, commas for brief pauses
- Include natural interjections and filler phrases: "bueno", "a ver", "mira", "oye", "pues", "claro", "vale" (adapt to ${language})
- Vary sentence length: mix short reactions with longer explanations
- Add "pauseAfterMs" values to control silence between turns: use 300-500ms for quick exchanges, 600-1000ms after questions or dramatic points, 200ms for rapid back-and-forth
- Avoid overly formal or written-style language; use spoken register appropriate for a panel discussion
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

Write the entire script in ${language}. Make it feel like a premium panel discussion where every voice adds genuine value. Prioritize spoken rhythm and natural flow over perfect grammar.`
}
