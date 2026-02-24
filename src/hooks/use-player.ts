"use client"

import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/stores/player-store"

// Singleton audio element - lives outside React lifecycle
let audioElement: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (typeof window === "undefined") {
    throw new Error("Audio can only be used in the browser")
  }
  if (!audioElement) {
    audioElement = new Audio()
    audioElement.preload = "auto"
  }
  return audioElement
}

export function usePlayer() {
  const store = usePlayerStore()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const audio = getAudio()

    // Sync audio events → store
    const onTimeUpdate = () => {
      store.setCurrentTime(audio.currentTime)
    }

    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        store.setDuration(audio.duration)
      }
    }

    const onEnded = () => {
      store.pause()
      store.setCurrentTime(0)
    }

    const onCanPlay = () => {
      store.setIsLoading(false)
    }

    const onWaiting = () => {
      store.setIsLoading(true)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("waiting", onWaiting)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("waiting", onWaiting)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync store changes → audio element
  useEffect(() => {
    const audio = getAudio()

    if (store.podcast?.audioUrl && audio.src !== store.podcast.audioUrl) {
      audio.src = store.podcast.audioUrl
      audio.load()
    }
  }, [store.podcast?.audioUrl])

  useEffect(() => {
    const audio = getAudio()
    if (store.isPlaying) {
      audio.play().catch(() => {
        store.pause()
      })
    } else {
      audio.pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isPlaying])

  useEffect(() => {
    const audio = getAudio()
    audio.volume = store.volume
  }, [store.volume])

  useEffect(() => {
    const audio = getAudio()
    audio.playbackRate = store.playbackRate
  }, [store.playbackRate])

  const seek = (time: number) => {
    const audio = getAudio()
    audio.currentTime = time
    store.setCurrentTime(time)
  }

  return {
    ...store,
    seek,
  }
}
