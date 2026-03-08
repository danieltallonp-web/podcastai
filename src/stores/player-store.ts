import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface PlayerPodcast {
  id: string
  title: string
  audioUrl: string
  durationSeconds: number
  format: string
}

interface PlayerState {
  // Current podcast
  podcast: PlayerPodcast | null
  // Playback state (reflects audio element state)
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  isLoading: boolean
  // Queue
  queue: PlayerPodcast[]

  // Actions — these ONLY update the store.
  // The hook (use-player) watches these and applies them to the audio element.
  setPodcast: (podcast: PlayerPodcast) => void
  setIsPlaying: (playing: boolean) => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  setIsLoading: (loading: boolean) => void
  addToQueue: (podcast: PlayerPodcast) => void
  clearQueue: () => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      podcast: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playbackRate: 1,
      isLoading: false,
      queue: [],

      setPodcast: (podcast) =>
        set({ podcast, currentTime: 0, duration: 0, isPlaying: false, isLoading: true }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      addToQueue: (podcast) =>
        set((state) => ({ queue: [...state.queue, podcast] })),

      clearQueue: () => set({ queue: [] }),

      reset: () =>
        set({
          podcast: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          isLoading: false,
        }),
    }),
    {
      name: "podcastai-player",
      partialize: (state) => ({
        podcast: state.podcast,
        currentTime: state.currentTime,
        volume: state.volume,
        playbackRate: state.playbackRate,
      }),
    }
  )
)
