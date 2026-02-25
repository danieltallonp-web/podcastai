"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePlayerStore } from "@/stores/player-store"

// Singleton audio element - lives outside React lifecycle
let audioElement: HTMLAudioElement | null = null
let isSeeking = false // Flag para distinguir seeks del usuario vs timeupdate

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

    const onSeeking = () => {
      console.log("🔍 SEEKING event fired. audio.currentTime:", audio.currentTime)
    }

    const onSeeked = () => {
      console.log("✔️ SEEKED event fired. audio.currentTime:", audio.currentTime)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("waiting", onWaiting)
    audio.addEventListener("seeking", onSeeking)
    audio.addEventListener("seeked", onSeeked)

    // Fallback interval for progress update if timeupdate doesn't fire frequently
    const progressInterval = setInterval(() => {
      if (!audio.paused && audio.src) {
        store.setCurrentTime(audio.currentTime)
      }
    }, 100)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("waiting", onWaiting)
      audio.removeEventListener("seeking", onSeeking)
      audio.removeEventListener("seeked", onSeeked)
      clearInterval(progressInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync store changes → audio element
  // Download audio as blob for better seeking support
  useEffect(() => {
    const audio = getAudio()
    if (!store.podcast?.audioUrl) return

    // Set loading state
    store.setIsLoading(true)

    const fetchAndPlayAudio = async () => {
      try {
        console.log("📥 Downloading audio file:", store.podcast?.audioUrl)
        const response = await fetch(store.podcast!.audioUrl)

        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`)
        }

        const blob = await response.blob()
        console.log("✅ Audio downloaded:", blob.size, "bytes")

        // Create blob URL for better seeking
        const blobUrl = URL.createObjectURL(blob)
        audio.src = blobUrl
        audio.load()

        console.log("🔗 Blob URL created and set")
        store.setIsLoading(false)
      } catch (error) {
        console.error("❌ Error downloading audio:", error)
        // Fallback to direct URL
        audio.src = store.podcast!.audioUrl
        audio.load()
        store.setIsLoading(false)
      }
    }

    fetchAndPlayAudio()
  }, [store.podcast?.audioUrl])

  useEffect(() => {
    const audio = getAudio()
    if (store.isPlaying) {
      console.log("▶️ Playing. audio.currentTime before play():", audio.currentTime)
      audio.play().catch((err) => {
        console.error("❌ audio.play() rejected:", err?.message || err)
        store.pause()
      })
      setTimeout(() => {
        console.log("▶️ After play() - audio.currentTime:", audio.currentTime)
      }, 50)
    } else {
      console.log("⏸️ Pausing")
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

  useEffect(() => {
    const audio = getAudio()
    // Si estamos en un seek del usuario, sincroniza siempre (sin threshold de 0.5s)
    // Si no, solo sincroniza si la diferencia es significativa
    if (isSeeking) {
      console.log("🎯 SYNC: Seeking is active, syncing without threshold")
      audio.currentTime = store.currentTime
      // No resetear el flag aquí - se resetea en el timeout de seek()
    } else if (Math.abs(audio.currentTime - store.currentTime) > 0.5) {
      console.log("🎯 SYNC: Normal timeupdate, difference > 0.5s")
      audio.currentTime = store.currentTime
    }
  }, [store.currentTime])

  const seek = useCallback((time: number) => {
    const audio = getAudio()
    const wasPlaying = !audio.paused

    console.log("🎯 SEEK called:", { time, duration: audio.duration, readyState: audio.readyState, currentTime: audio.currentTime })

    try {
      // Marcar que estamos en un seek
      isSeeking = true

      // Cambiar el currentTime directamente - el navegador lo maneja
      audio.currentTime = time
      console.log("✅ Set audio.currentTime =", time)

      // Actualizar el store TAMBIÉN con el mismo valor
      store.setCurrentTime(time)

      // Si estaba reproduciendo, reanudar después de un pequeño delay
      if (wasPlaying) {
        setTimeout(() => {
          audio.play().catch((err) => {
            console.error("❌ Resume after seek failed:", err)
          })
        }, 50)
      }

      // Resetear flag de seek después de 300ms
      setTimeout(() => {
        isSeeking = false
      }, 300)
    } catch (e) {
      console.error("❌ SEEK error:", e)
      isSeeking = false
    }
  }, [])

  return {
    ...store,
    seek,
  }
}
