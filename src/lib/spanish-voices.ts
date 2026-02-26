/**
 * Spanish Voice Profiles for ElevenLabs
 * These are professional, native Spanish speakers optimized for podcast generation
 */

export interface SpanishVoiceProfile {
  voiceId: string
  name: string
  gender: "male" | "female"
  accent: "neutral" | "spain" | "latin"
  personality: string[]
  bestFor: string[]
  speed: number // Recommended speaking speed (0.75 - 1.25)
  description: string
}

export const SPANISH_VOICES: Record<string, SpanishVoiceProfile> = {
  // Male voices - Using multilingual voices with Spanish optimization
  diego: {
    voiceId: "IKne3meq5aSn9XLyUdCD", // Charlie - Deep, Confident, Energetic
    name: "Diego",
    gender: "male",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "NARRATION"],
    speed: 1.0,
    description: "Professional voice with deep, confident tone. Clear and engaging for educational content.",
  },
  pablo: {
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George - Warm, Captivating Storyteller
    name: "Pablo",
    gender: "male",
    accent: "neutral",
    personality: ["formal", "authoritative", "serious"],
    bestFor: ["CLASS", "INTERVIEW", "ROUNDTABLE", "DEBATE"],
    speed: 0.95,
    description: "Formal voice with warm resonance. Ideal for educational and professional content.",
  },
  carlos: {
    voiceId: "CwhRBWXzGAHq8TQ4Fs17", // Roger - Laid-Back, Casual, Resonant
    name: "Carlos",
    gender: "male",
    accent: "neutral",
    personality: ["casual", "friendly", "warm"],
    bestFor: ["CONVERSATION", "INTERVIEW", "ROUNDTABLE", "MONOLOGUE"],
    speed: 1.05,
    description: "Casual and friendly voice. Perfect for conversational and informal podcasts.",
  },
  juan: {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ", // Liam - Energetic, Social Media Creator
    name: "Juan",
    gender: "male",
    accent: "neutral",
    personality: ["warm", "friendly", "expressive"],
    bestFor: ["NARRATION", "CONVERSATION", "INTERVIEW"],
    speed: 1.0,
    description: "Warm and energetic voice. Great for storytelling and engaging narratives.",
  },

  // Female voices - Using multilingual voices with Spanish optimization
  sofia: {
    voiceId: "Xb7hH8MSUJpSbSDYk0k2", // Alice - Clear, Engaging Educator
    name: "Sofía",
    gender: "female",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "ROUNDTABLE"],
    speed: 1.0,
    description: "Professional voice with clear, engaging delivery. Authoritative for educational content.",
  },
  elena: {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - Mature, Reassuring, Confident
    name: "Elena",
    gender: "female",
    accent: "neutral",
    personality: ["dynamic", "energetic", "engaging"],
    bestFor: ["DEBATE", "ROUNDTABLE", "INTERVIEW", "CONVERSATION"],
    speed: 1.05,
    description: "Dynamic voice with confident delivery. Perfect for debates and lively discussions.",
  },
  maria: {
    voiceId: "cgSgspJ2msm6clMCkdW9", // Jessica - Playful, Bright, Warm
    name: "María",
    gender: "female",
    accent: "neutral",
    personality: ["warm", "friendly", "expressive"],
    bestFor: ["NARRATION", "CONVERSATION", "INTERVIEW"],
    speed: 1.0,
    description: "Warm and friendly voice with playful quality. Excellent for storytelling and narratives.",
  },
  ana: {
    voiceId: "XrExE9yKIg1WjnnlVkGX", // Matilda - Knowledgable, Professional
    name: "Ana",
    gender: "female",
    accent: "neutral",
    personality: ["casual", "friendly", "conversational"],
    bestFor: ["CONVERSATION", "INTERVIEW", "ROUNDTABLE"],
    speed: 1.05,
    description: "Friendly professional voice with conversational tone. Great for casual discussions.",
  },
}

/**
 * Get the best voice for a given podcast format
 */
export function getVoiceForFormat(format: string): SpanishVoiceProfile {
  const voicePreferences: Record<string, string[]> = {
    MONOLOGUE: ["diego", "sofia"],
    CONVERSATION: ["carlos", "ana", "juan"],
    DEBATE: ["elena", "pablo"],
    NARRATION: ["maria", "juan"],
    CLASS: ["diego", "pablo", "sofia"],
    ROUNDTABLE: ["sofia", "elena", "carlos"],
    INTERVIEW: ["diego", "sofia", "carlos"],
    INTERACTIVE: ["maria", "juan", "ana"],
  }

  const preferred = voicePreferences[format] || ["diego"]
  return SPANISH_VOICES[preferred[0]]
}

/**
 * Get a complementary voice for multi-speaker formats
 */
export function getComplementaryVoice(
  primaryVoiceKey: string,
  format: string,
  gender?: "male" | "female"
): SpanishVoiceProfile {
  const primaryVoice = SPANISH_VOICES[primaryVoiceKey]
  if (!primaryVoice) return SPANISH_VOICES["sofia"]

  // Get voices that are good for this format and different gender
  const targetGender = gender || (primaryVoice.gender === "male" ? "female" : "male")
  const suitable = Object.values(SPANISH_VOICES).filter(
    (v) => v.bestFor.includes(format) && v.gender === targetGender && v.voiceId !== primaryVoice.voiceId
  )

  return suitable.length > 0 ? suitable[0] : SPANISH_VOICES["sofia"]
}

/**
 * Get all available Spanish voices
 */
export function getAllSpanishVoices(): SpanishVoiceProfile[] {
  return Object.values(SPANISH_VOICES)
}

/**
 * Get voices by gender
 */
export function getVoicesByGender(gender: "male" | "female"): SpanishVoiceProfile[] {
  return Object.values(SPANISH_VOICES).filter((v) => v.gender === gender)
}
