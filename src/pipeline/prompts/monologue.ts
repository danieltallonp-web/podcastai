// Plantilla de prompt para formato monologo (un solo narrador)
// Genera una exposicion clara con introduccion, desarrollo y conclusion

interface MonologuePromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
}

export function getMonologuePrompt(params: MonologuePromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext } = params

  // En monologo normalmente es 1 voz, pero permitimos mas por si hay cohost breve
  const primaryVoice = 0
  const estimatedBlocks = Math.max(8, Math.round(duration * 4))

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a compelling monologue-style podcast episode about the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF VOICES: ${numberOfVoices} (primarily voiceIndex ${primaryVoice}${numberOfVoices > 1 ? `, with voiceIndex 1 to ${numberOfVoices - 1} for brief supporting moments` : ""})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

MONOLOGUE GUIDELINES:
- The speaker addresses the audience directly in a clear, engaging manner
- Build a logical flow: introduce the topic, explore key ideas, then conclude with impact
- Use rhetorical questions to maintain listener engagement ("Have you ever wondered...?")
- Include concrete examples, anecdotes, or data to support main points
- Vary pacing: some sections should be more energetic, others more reflective
- Create smooth transitions between ideas
- The speaker should demonstrate genuine passion and knowledge about the topic
${numberOfVoices > 1 ? "- Secondary voices can appear briefly for quotes, examples, or short interjections" : ""}

STRUCTURE:
- "intro" segment: hook the listener, introduce yourself and the topic with energy
- "main" segment(s): develop the core ideas in a logical progression (3-5 key points)
- "outro" segment: powerful summary, final reflection, and call to action for the audience

Aim for approximately ${estimatedBlocks} blocks total across all segments.

EMOTION USAGE:
Use these emotions to guide vocal delivery:
- "neutral": standard narration and explanations
- "happy": when sharing positive outcomes or uplifting ideas
- "serious": for critical information, warnings, or weighty points
- "excited": for revelations, amazing facts, or building momentum
- "thoughtful": for philosophical musings, reflections, or nuanced takes

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
          "text": "string - what the speaker says",
          "emotion": "neutral" | "happy" | "serious" | "excited" | "thoughtful"
        }
      ]
    }
  ]
}

Write the entire script in ${language}. Make it sound like a polished but natural speaker, not a robot reading a script.`
}
