import { type PodcastFormat, type PodcastStatus, type Plan } from "@prisma/client"

// ==========================================
// PODCAST CONFIGURATION (what the user selects)
// ==========================================

export interface PodcastConfig {
  // Simple mode fields
  prompt: string
  format: PodcastFormat
  duration: number // minutes
  tone: string[]
  language: string

  // Advanced: Content & Structure
  sources?: SourceInput[]
  depth?: "superficial" | "intermediate" | "expert"
  segments?: string[]
  continuationOfPodcastId?: string
  dateRange?: { start: string; end: string }

  // Advanced: Format & Narrative
  mixLanguages?: boolean
  secondaryLanguage?: string
  interactive?: boolean
  interactionPoints?: number

  // Advanced: Voices & Characters
  voices: VoiceConfig[]

  // Advanced: Audio Production
  music?: string
  musicVolume?: number
  sfx?: string
  intro?: string
  pausesBetweenSections?: string
  audioQuality?: string

  // Advanced: Story Personalization (narration only)
  story?: StoryConfig

  // Advanced: Output
  outputFormat?: string
  generateTranscript?: boolean
  exportScript?: boolean
  generateVideo?: boolean
  generateClips?: boolean
}

export interface VoiceConfig {
  voiceId: string
  name: string
  role?: string // "host", "expert", "narrator", etc.
  personality?: string // "optimistic", "skeptical", etc.
  accent?: string
  speed?: number // 0.75 - 1.5
}

export interface StoryConfig {
  protagonistName?: string
  protagonistAge?: number
  secondaryCharacters?: { name: string; relation: string }[]
  setting?: string
  customSetting?: string
  themes?: string[]
  tensionLevel?: "very_soft" | "soft" | "moderate" | "intense"
  chapterDuration?: number
}

export interface SourceInput {
  type: "url" | "file" | "text"
  value: string // URL, file path in storage, or raw text
  name?: string
}

// ==========================================
// SCRIPT JSON (output from Claude)
// ==========================================

export interface PodcastScript {
  title: string
  description: string
  estimatedDuration: number // seconds
  segments: ScriptSegment[]
}

export interface ScriptSegment {
  type: "intro" | "conversation" | "narration" | "outro" | "transition"
  music?: string
  musicVolume?: number
  blocks: ScriptBlock[]
}

export interface ScriptBlock {
  voiceId: string
  voiceName: string
  text: string
  emotion?: string // "warm", "enthusiastic", "curious", "serious", etc.
  pauseAfterMs?: number
  sfx?: string // sound effect cue
}

// ==========================================
// GENERATION PROGRESS
// ==========================================

export interface GenerationProgress {
  podcastId: string
  status: PodcastStatus
  progress: number // 0-100
  message: string
  currentStep?: string
  estimatedSecondsRemaining?: number
  error?: string
}

// ==========================================
// VOICE (from ElevenLabs)
// ==========================================

export interface Voice {
  id: string
  name: string
  previewUrl?: string
  category?: string
  labels?: Record<string, string>
  description?: string
}

// ==========================================
// USER & PLAN
// ==========================================

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  name: string | null
  imageUrl: string | null
  plan: Plan
  onboardingCompleted: boolean
  interests: string[]
  preferredFormats: string[]
  preferredTone: string | null
  preferredLanguage: string
}

export interface PlanInfo {
  name: string
  plan: Plan
  price: number
  podcastsPerMonth: number
  maxDuration: number
  maxVoices: number
  advancedMode: boolean
}

// ==========================================
// API RESPONSES
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface GenerateResponse {
  podcastId: string
  estimatedTime: number // seconds
}

// ==========================================
// PLAYER STATE
// ==========================================

export interface PlayerPodcast {
  id: string
  title: string
  description?: string | null
  audioUrl: string
  durationSeconds: number
  format: PodcastFormat
  createdAt: string
}
