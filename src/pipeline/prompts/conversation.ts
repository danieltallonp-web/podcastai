// Plantilla de prompt para formato conversacional (2+ personas)
// Genera un dialogo natural con intercambios, reacciones y dinamismo

interface ConversationPromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
}

export function getConversationPrompt(params: ConversationPromptParams): string {
  const { topic, duration, tone, language, numberOfVoices, researchContext } = params

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
- voiceIndex 0: the host or primary conversation driver
- voiceIndex 1 to ${numberOfVoices - 1}: co-hosts or guests with their own viewpoints

EMOTION USAGE:
Use these emotions to convey the right delivery tone for each block:
- "neutral": standard conversational delivery
- "happy": when sharing positive insights or agreeing enthusiastically
- "serious": for important points or sobering facts
- "excited": for surprising discoveries or passionate moments
- "thoughtful": for reflective or nuanced observations

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

Write the entire script in ${language}. Make it sound like a real conversation, not a scripted reading.`
}
