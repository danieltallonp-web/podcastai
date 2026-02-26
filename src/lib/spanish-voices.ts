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
    voiceId: "ZCh4e9eZSUf41K4cmCEL", // Charlie - Deep, Confident, Energetic
    name: "Diego",
    gender: "male",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "NARRATION"],
    speed: 1.0,
    description: "Professional voice with deep, confident tone. Clear and engaging for educational content.",
  },
  pablo: {
    voiceId: "Vpv1YgvVd6CHIzOTiTt8", // George - Warm, Captivating Storyteller
    name: "Pablo",
    gender: "male",
    accent: "neutral",
    personality: ["formal", "authoritative", "serious"],
    bestFor: ["CLASS", "INTERVIEW", "ROUNDTABLE", "DEBATE"],
    speed: 0.95,
    description: "Formal voice with warm resonance. Ideal for educational and professional content.",
  },
  carlos: {
    voiceId: "PcAHoDMdlTbdDxdz24IK", // Roger - Laid-Back, Casual, Resonant
    name: "Carlos",
    gender: "male",
    accent: "neutral",
    personality: ["casual", "friendly", "warm"],
    bestFor: ["CONVERSATION", "INTERVIEW", "ROUNDTABLE", "MONOLOGUE"],
    speed: 1.05,
    description: "Casual and friendly voice. Perfect for conversational and informal podcasts.",
  },
  juan: {
    voiceId: "5egO01tkUjEzu7xSSE8M", // Liam - Energetic, Social Media Creator
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
    voiceId: "gD1IexrzCvsXPHUuT0s3", // Alice - Clear, Engaging Educator
    name: "Sofía",
    gender: "female",
    accent: "neutral",
    personality: ["professional", "clear", "engaging"],
    bestFor: ["MONOLOGUE", "CLASS", "INTERVIEW", "ROUNDTABLE"],
    speed: 1.0,
    description: "Professional voice with clear, engaging delivery. Authoritative for educational content.",
  },
  elena: {
    voiceId: "RgXx32WYOGrd7gFNifSf", // Sarah - Mature, Reassuring, Confident
    name: "Elena",
    gender: "female",
    accent: "neutral",
    personality: ["dynamic", "energetic", "engaging"],
    bestFor: ["DEBATE", "ROUNDTABLE", "INTERVIEW", "CONVERSATION"],
    speed: 1.05,
    description: "Dynamic voice with confident delivery. Perfect for debates and lively discussions.",
  },
  maria: {
    voiceId: "UOIqAnmS11Reiei1Ytkc", // Jessica - Playful, Bright, Warm
    name: "María",
    gender: "female",
    accent: "neutral",
    personality: ["warm", "friendly", "expressive"],
    bestFor: ["NARRATION", "CONVERSATION", "INTERVIEW"],
    speed: 1.0,
    description: "Warm and friendly voice with playful quality. Excellent for storytelling and narratives.",
  },
  ana: {
    voiceId: "Ir1QNHvhaJXbAGhT50w3", // Matilda - Knowledgable, Professional
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

/**
 * Get multiple complementary voices for a format (for multi-speaker podcasts)
 * Returns an array of voices with alternating genders for better variety
 */
export function getVoicesForFormat(format: string, count: number = 2): SpanishVoiceProfile[] {
  const voicePreferences: Record<string, string[]> = {
    MONOLOGUE: ["diego"],
    CONVERSATION: ["carlos", "ana", "juan", "maria"],
    DEBATE: ["pablo", "elena", "carlos", "sofia"],
    NARRATION: ["maria", "juan"],
    CLASS: ["diego", "sofia", "pablo"],
    ROUNDTABLE: ["sofia", "elena", "carlos", "pablo"],
    INTERVIEW: ["diego", "sofia", "carlos", "ana"],
    INTERACTIVE: ["maria", "juan", "ana", "carlos"],
  }

  const preferred = voicePreferences[format] || ["diego", "sofia"]

  // Get requested number of voices, cycling through the preferred list
  const result: SpanishVoiceProfile[] = []
  for (let i = 0; i < count && i < preferred.length; i++) {
    const voiceKey = preferred[i]
    const voice = SPANISH_VOICES[voiceKey]
    if (voice) {
      result.push(voice)
    }
  }

  // If we need more voices and ran out, add voices with alternating gender
  if (result.length < count) {
    const lastGender = result[result.length - 1]?.gender
    const allVoices = Object.values(SPANISH_VOICES)
    const otherGenderVoices = allVoices.filter(
      (v) => v.bestFor.includes(format) && v.gender !== lastGender
    )

    for (let i = result.length; i < count && otherGenderVoices.length > 0; i++) {
      const idx = (i - result.length) % otherGenderVoices.length
      const voice = otherGenderVoices[idx]
      if (!result.some((v) => v.voiceId === voice.voiceId)) {
        result.push(voice)
      }
    }
  }

  // Fallback: if still not enough, fill with alternating male/female
  if (result.length < count) {
    const maleVoices = getVoicesByGender("male")
    const femaleVoices = getVoicesByGender("female")
    let maleIdx = 0
    let femaleIdx = 0

    while (result.length < count) {
      if (result.length % 2 === 0) {
        const voice = maleVoices[maleIdx % maleVoices.length]
        if (!result.some((v) => v.voiceId === voice.voiceId)) {
          result.push(voice)
        }
        maleIdx++
      } else {
        const voice = femaleVoices[femaleIdx % femaleVoices.length]
        if (!result.some((v) => v.voiceId === voice.voiceId)) {
          result.push(voice)
        }
        femaleIdx++
      }
    }
  }

  return result.slice(0, count)
}
