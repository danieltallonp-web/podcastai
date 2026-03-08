import { create } from "zustand"
import type { PodcastConfig, VoiceConfig, StoryConfig, SourceInput } from "@/types"
import { getVoicesForFormat } from "@/lib/spanish-voices"

interface CreateState {
  // Mode
  mode: "simple" | "advanced"

  // Simple mode fields
  prompt: string
  format: string
  duration: number
  tone: string
  language: string

  // Advanced mode fields
  detailedPrompt: string
  sources: SourceInput[]
  researchDepth: "basic" | "intermediate" | "deep"
  contentStructure: "auto" | "chronological" | "thematic" | "qa"
  timePeriod: string

  // Format & Narrative
  advancedTones: string[]
  mixLanguages: boolean
  interactivityLevel: number

  // Voices
  numberOfVoices: number
  voices: VoiceConfig[]

  // Production
  musicStyle: string
  musicVolume: number
  sfxLevel: string
  introStyle: string
  pauseBetweenSections: number
  audioQuality: string

  // Story
  storyConfig: StoryConfig

  // Output
  outputFormat: string
  includeTranscript: boolean
  exportScript: boolean
  generateVideo: boolean
  generateClips: boolean

  // Preset
  selectedPresetId: string | null

  // Actions
  setMode: (mode: "simple" | "advanced") => void
  setPrompt: (prompt: string) => void
  setFormat: (format: string) => void
  setFormatWithVoices: (format: string) => void
  setDuration: (duration: number) => void
  setTone: (tone: string) => void
  setLanguage: (language: string) => void
  setDetailedPrompt: (prompt: string) => void
  setSources: (sources: SourceInput[]) => void
  setResearchDepth: (depth: "basic" | "intermediate" | "deep") => void
  setContentStructure: (structure: "auto" | "chronological" | "thematic" | "qa") => void
  setTimePeriod: (period: string) => void
  setAdvancedTones: (tones: string[]) => void
  setMixLanguages: (mix: boolean) => void
  setInteractivityLevel: (level: number) => void
  setNumberOfVoices: (n: number) => void
  setVoices: (voices: VoiceConfig[]) => void
  setMusicStyle: (style: string) => void
  setMusicVolume: (volume: number) => void
  setSfxLevel: (level: string) => void
  setIntroStyle: (style: string) => void
  setPauseBetweenSections: (seconds: number) => void
  setAudioQuality: (quality: string) => void
  setStoryConfig: (config: Partial<StoryConfig>) => void
  setOutputFormat: (format: string) => void
  setIncludeTranscript: (include: boolean) => void
  setExportScript: (exp: boolean) => void
  setGenerateVideo: (gen: boolean) => void
  setGenerateClips: (gen: boolean) => void
  setSelectedPresetId: (id: string | null) => void
  loadPreset: (config: Partial<PodcastConfig>) => void
  getConfig: () => PodcastConfig
  reset: () => void
}

const initialState = {
  mode: "simple" as const,
  prompt: "",
  format: "conversation",
  duration: 15,
  tone: "casual",
  language: "es",
  detailedPrompt: "",
  sources: [] as SourceInput[],
  researchDepth: "intermediate" as const,
  contentStructure: "auto" as const,
  timePeriod: "",
  advancedTones: ["casual"],
  mixLanguages: false,
  interactivityLevel: 0,
  numberOfVoices: 2,
  voices: [] as VoiceConfig[],
  musicStyle: "none",
  musicVolume: 30,
  sfxLevel: "subtle",
  introStyle: "standard",
  pauseBetweenSections: 1,
  audioQuality: "high",
  storyConfig: {
    protagonistName: "",
    protagonistAge: 0,
    secondaryCharacters: [],
    setting: "",
    themes: [],
    tensionLevel: "moderate",
  } as StoryConfig,
  outputFormat: "mp3",
  includeTranscript: false,
  exportScript: false,
  generateVideo: false,
  generateClips: false,
  selectedPresetId: null as string | null,
}

export const useCreateStore = create<CreateState>()((set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),
  setPrompt: (prompt) => set({ prompt }),
  setFormat: (format) => set({ format }),
  setDuration: (duration) => set({ duration }),
  setTone: (tone) => set({ tone }),
  setLanguage: (language) => set({ language }),
  setDetailedPrompt: (detailedPrompt) => set({ detailedPrompt }),
  setSources: (sources) => set({ sources }),
  setResearchDepth: (researchDepth) => set({ researchDepth }),
  setContentStructure: (contentStructure) => set({ contentStructure }),
  setTimePeriod: (timePeriod) => set({ timePeriod }),
  setAdvancedTones: (advancedTones) => set({ advancedTones }),
  setMixLanguages: (mixLanguages) => set({ mixLanguages }),
  setInteractivityLevel: (interactivityLevel) => set({ interactivityLevel }),
  setNumberOfVoices: (numberOfVoices) => set({ numberOfVoices }),
  setVoices: (voices) => set({ voices }),
  setMusicStyle: (musicStyle) => set({ musicStyle }),
  setMusicVolume: (musicVolume) => set({ musicVolume }),
  setSfxLevel: (sfxLevel) => set({ sfxLevel }),
  setIntroStyle: (introStyle) => set({ introStyle }),
  setPauseBetweenSections: (pauseBetweenSections) =>
    set({ pauseBetweenSections }),
  setAudioQuality: (audioQuality) => set({ audioQuality }),
  setStoryConfig: (config) =>
    set((state) => ({
      storyConfig: { ...state.storyConfig, ...config },
    })),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setIncludeTranscript: (includeTranscript) => set({ includeTranscript }),
  setExportScript: (exportScript) => set({ exportScript }),
  setGenerateVideo: (generateVideo) => set({ generateVideo }),
  setGenerateClips: (generateClips) => set({ generateClips }),
  setSelectedPresetId: (selectedPresetId) => set({ selectedPresetId }),

  loadPreset: (config) => {
    set({
      format: config.format ?? get().format,
      duration: config.duration ?? get().duration,
      tone: (config.tone?.[0] ?? get().tone) as string,
      language: config.language ?? get().language,
      numberOfVoices: config.voices?.length ?? get().numberOfVoices,
      voices: config.voices ?? get().voices,
      musicStyle: config.music ?? get().musicStyle,
      sfxLevel: config.sfx ?? get().sfxLevel,
      audioQuality: config.audioQuality ?? get().audioQuality,
    })
  },

  setFormatWithVoices: (format: string) => {
    // Determine number of voices based on format
    const voiceCountByFormat: Record<string, number> = {
      MONOLOGUE: 1,
      CONVERSATION: 2,
      DEBATE: 2,
      NARRATION: 1,
      CLASS: 1,
      ROUNDTABLE: 3,
      INTERVIEW: 2,
      INTERACTIVE: 2,
    }

    const voiceCount = voiceCountByFormat[format] ?? 2
    const voices = getVoicesForFormat(format, voiceCount).map((v) => ({
      voiceId: v.voiceId,
      name: v.name,
    }))

    set({
      format,
      numberOfVoices: voiceCount,
      voices,
    })
  },

  getConfig: (): PodcastConfig => {
    const state = get()
    const tones =
      state.mode === "advanced" && state.advancedTones.length > 0
        ? state.advancedTones
        : [state.tone]
    return {
      prompt: state.mode === "advanced" ? state.detailedPrompt : state.prompt,
      format: state.format as any,
      duration: state.duration,
      tone: tones,
      language: state.language,
      sources: state.sources,
      depth: state.researchDepth as any,
      mixLanguages: state.mixLanguages,
      voices: state.voices,
      music: state.musicStyle,
      musicVolume: state.musicVolume,
      sfx: state.sfxLevel,
      intro: state.introStyle,
      pausesBetweenSections: state.pauseBetweenSections.toString(),
      audioQuality: state.audioQuality,
      story: state.storyConfig,
      outputFormat: state.outputFormat,
      generateTranscript: state.includeTranscript,
      exportScript: state.exportScript,
      generateVideo: state.generateVideo,
      generateClips: state.generateClips,
    }
  },

  reset: () => set(initialState),
}))
