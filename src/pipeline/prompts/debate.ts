// Plantilla de prompt para formato debate (2+ personas con posiciones opuestas)
// Genera argumentos, contraargumentos y moderacion

interface DebatePromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
}

export function getDebatePrompt(params: DebatePromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext } = params

  const estimatedBlocks = Math.max(12, Math.round(duration * 7))
  const hasExplicitModerator = numberOfVoices >= 3

  return `You are a podcast script generator. Write ALL content in ${language}.

Your task is to create a structured but lively debate between speakers who hold different positions on the following topic:

TOPIC: ${topic}
TONE: ${tone}
TARGET DURATION: approximately ${duration} minutes
NUMBER OF SPEAKERS: ${numberOfVoices} (use voiceIndex 0 to ${numberOfVoices - 1})
${researchContext ? `\nRESEARCH CONTEXT (use this information as source material):\n${researchContext}\n` : ""}

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
          "emotion": "neutral" | "happy" | "serious" | "excited" | "thoughtful"
        }
      ]
    }
  ]
}

Write the entire script in ${language}. Make it feel like a real intellectual debate, not a rehearsed script.`
}
