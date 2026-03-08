"use client"

import { useCallback } from "react"
import { usePlayerStore } from "@/stores/player-store"

// ─── Singleton audio element + listeners (lives OUTSIDE React) ───
let audioElement: HTMLAudioElement | null = null
let currentSrc = ""
let isSeeking = false // Module-level flag, shared across all consumers
let storeUnsubscribe: (() => void) | null = null

function initAudio(): HTMLAudioElement {
  if (typeof window === "undefined") {
    throw new Error("Audio can only be used in the browser")
  }

  if (audioElement) return audioElement

  // Create the singleton
  const audio = new Audio()
  audio.preload = "auto"
  audioElement = audio

  // ─── Audio → Store (event listeners, attached ONCE at creation) ───

  audio.addEventListener("timeupdate", () => {
    if (isSeeking) return
    usePlayerStore.setState({ currentTime: audio.currentTime })
  })

  audio.addEventListener("durationchange", () => {
    if (audio.duration && isFinite(audio.duration)) {
      usePlayerStore.setState({ duration: audio.duration })
    }
  })

  audio.addEventListener("ended", () => {
    usePlayerStore.setState({ isPlaying: false, currentTime: 0 })
  })

  audio.addEventListener("canplay", () => {
    usePlayerStore.setState({ isLoading: false })
  })

  audio.addEventListener("waiting", () => {
    usePlayerStore.setState({ isLoading: true })
  })

  audio.addEventListener("play", () => {
    usePlayerStore.setState({ isPlaying: true })
  })

  audio.addEventListener("pause", () => {
    if (!isSeeking) {
      usePlayerStore.setState({ isPlaying: false })
    }
  })

  // ─── Store → Audio (Zustand subscribe, NO React effects) ───

  let prevState = usePlayerStore.getState()

  // Apply initial volume & rate
  audio.volume = prevState.volume
  audio.playbackRate = prevState.playbackRate

  storeUnsubscribe = usePlayerStore.subscribe((state) => {
    const prev = prevState
    prevState = state

    // Source changed → load new audio
    const url = state.podcast?.audioUrl
    const prevUrl = prev.podcast?.audioUrl
    if (url && url !== prevUrl) {
      if (currentSrc !== url) {
        currentSrc = url
        audio.src = url
      }
    }

    // Play/pause changed
    if (state.isPlaying !== prev.isPlaying) {
      if (state.isPlaying && audio.paused && audio.src) {
        audio.play().catch(() => {
          usePlayerStore.setState({ isPlaying: false })
        })
      } else if (!state.isPlaying && !audio.paused) {
        audio.pause()
      }
    }

    // Volume changed
    if (state.volume !== prev.volume) {
      audio.volume = state.volume
    }

    // Playback rate changed
    if (state.playbackRate !== prev.playbackRate) {
      audio.playbackRate = state.playbackRate
    }
  })

  return audio
}

// ─── Seek function (module-level, shared) ───
function seekAudio(time: number) {
  const audio = initAudio()
  if (!audio.src || !isFinite(audio.duration)) return

  const clampedTime = Math.max(0, Math.min(time, audio.duration))

  isSeeking = true
  audio.currentTime = clampedTime
  usePlayerStore.setState({ currentTime: clampedTime })

  // Resume playback if it was playing
  if (usePlayerStore.getState().isPlaying) {
    audio.play().catch(() => {})
  }

  // Allow timeupdate to flow again after the browser has settled
  setTimeout(() => {
    isSeeking = false
  }, 250)
}

/**
 * usePlayer — thin React wrapper around the module-level audio singleton.
 *
 * All audio event listeners and store↔audio sync happen OUTSIDE React,
 * so React Strict Mode double-invoke has zero effect.
 */
export function usePlayer() {
  // Ensure audio is initialized (safe to call multiple times)
  if (typeof window !== "undefined") {
    initAudio()
  }

  const store = usePlayerStore()

  const seek = useCallback((time: number) => {
    seekAudio(time)
  }, [])

  return {
    podcast: store.podcast,
    isPlaying: store.isPlaying,
    currentTime: store.currentTime,
    duration: store.duration,
    volume: store.volume,
    playbackRate: store.playbackRate,
    isLoading: store.isLoading,
    queue: store.queue,
    // Actions that go through the store (UI toggles)
    setPodcast: store.setPodcast,
    togglePlay: store.togglePlay,
    setVolume: store.setVolume,
    setPlaybackRate: store.setPlaybackRate,
    // Direct audio action
    seek,
  }
}
