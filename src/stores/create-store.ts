import { create } from "zustand"
import type { PodcastConfig, VoiceConfig, StoryConfig, SourceInput } from "@/types"

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
  researchDepth: "basic" | "moderate" | "deep"
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
  setDuration: (duration: number) => void
  setTone: (tone: string) => void
  setLanguage: (language: string) => void
  setDetailedPrompt: (prompt: string) => void
  setSources: (sources: SourceInput[]) => void
  setResearchDepth: (depth: "basic" | "moderate" | "deep") => void
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
  researchDepth: "moderate" as const,
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
    protagonistAge: "",
    secondaryCharacters: [],
    setting: "",
    theme: "",
    tensionLevel: 5,
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
      tone: config.tone ?? get().tone,
      language: config.language ?? get().language,
      numberOfVoices: config.numberOfVoices ?? get().numberOfVoices,
      musicStyle: config.musicStyle ?? get().musicStyle,
      sfxLevel: config.sfxLevel ?? get().sfxLevel,
      audioQuality: config.audioQuality ?? get().audioQuality,
    })
  },

  getConfig: (): PodcastConfig => {
    const state = get()
    return {
      prompt: state.mode === "advanced" ? state.detailedPrompt : state.prompt,
      format: state.format,
      duration: state.duration,
      tone: state.tone,
      language: state.language,
      sources: state.sources,
      researchDepth: state.researchDepth,
      contentStructure: state.contentStructure,
      timePeriod: state.timePeriod,
      advancedTones: state.advancedTones,
      mixLanguages: state.mixLanguages,
      interactivityLevel: state.interactivityLevel,
      numberOfVoices: state.numberOfVoices,
      voices: state.voices,
      musicStyle: state.musicStyle,
      musicVolume: state.musicVolume,
      sfxLevel: state.sfxLevel,
      introStyle: state.introStyle,
      pauseBetweenSections: state.pauseBetweenSections,
      audioQuality: state.audioQuality,
      storyConfig: state.storyConfig,
      outputFormat: state.outputFormat,
      includeTranscript: state.includeTranscript,
      exportScript: state.exportScript,
      generateVideo: state.generateVideo,
      generateClips: state.generateClips,
    }
  },

  reset: () => set(initialState),
}))
