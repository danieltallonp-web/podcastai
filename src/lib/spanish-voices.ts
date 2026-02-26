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
  // Male voices
  diego: {
    voiceId: "ByGfLN5mM7p5WHDd0Ev4", // Spanish male, neutral
    name: "Diego",
    gender: "male",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "NARRATION"],
    speed: 1.0,
    description: "Professional Spanish male voice, neutral accent. Clear and engaging for educational content.",
  },
  pablo: {
    voiceId: "jBpfuIE2acCNq3Kh8isT", // Spanish male, neutral
    name: "Pablo",
    gender: "male",
    accent: "neutral",
    personality: ["formal", "authoritative", "serious"],
    bestFor: ["CLASS", "INTERVIEW", "ROUNDTABLE", "DEBATE"],
    speed: 0.95,
    description: "Formal Spanish male voice. Ideal for educational and professional content.",
  },
  carlos: {
    voiceId: "nPczCjzI2devNBz1zQrb", // Spanish male, casual
    name: "Carlos",
    gender: "male",
    accent: "neutral",
    personality: ["casual", "friendly", "warm"],
    bestFor: ["CONVERSATION", "INTERVIEW", "ROUNDTABLE", "MONOLOGUE"],
    speed: 1.05,
    description: "Casual Spanish male voice. Perfect for conversational and informal podcasts.",
  },
  juan: {
    voiceId: "Er2LC6xLECRZ9HyJTnxQ", // Spanish male, warm
    name: "Juan",
    gender: "male",
    accent: "spain",
    personality: ["warm", "friendly", "expressive"],
    bestFor: ["NARRATION", "CONVERSATION", "INTERVIEW"],
    speed: 1.0,
    description: "Warm Spanish male voice with Castilian accent. Great for storytelling.",
  },

  // Female voices
  sofia: {
    voiceId: "ETo6UvWohIHV7PmqVjWH", // Spanish female, neutral
    name: "Sofía",
    gender: "female",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "ROUNDTABLE"],
    speed: 1.0,
    description: "Professional Spanish female voice, neutral accent. Clear and authoritative.",
  },
  elena: {
    voiceId: "r7wLdmG9VyWqYBP8p1zL", // Spanish female, dynamic
    name: "Elena",
    gender: "female",
    accent: "neutral",
    personality: ["dynamic", "energetic", "engaging"],
    bestFor: ["DEBATE", "ROUNDTABLE", "INTERVIEW", "CONVERSATION"],
    speed: 1.05,
    description: "Dynamic Spanish female voice. Perfect for debates and lively discussions.",
  },
  maria: {
    voiceId: "IKne3meq5aSrNMjlHZhf", // Spanish female, warm
    name: "María",
    gender: "female",
    accent: "neutral",
    personality: ["warm", "friendly", "expressive"],
    bestFor: ["NARRATION", "CONVERSATION", "INTERVIEW"],
    speed: 1.0,
    description: "Warm Spanish female voice. Excellent for storytelling and narratives.",
  },
  ana: {
    voiceId: "VR6AewLTigWG4xSOL86w", // Spanish female, casual
    name: "Ana",
    gender: "female",
    accent: "latin",
    personality: ["casual", "friendly", "conversational"],
    bestFor: ["CONVERSATION", "INTERVIEW", "ROUNDTABLE"],
    speed: 1.05,
    description: "Casual Spanish female voice with Latin American accent. Great for casual conversations.",
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
