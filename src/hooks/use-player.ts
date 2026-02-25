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

    console.log("🎯 SEEK called:", { time, duration: audio.duration, readyState: audio.readyState, paused: audio.paused, currentTimeBefore: audio.currentTime })

    const wasPlaying = !audio.paused

    try {
      // Activar flag ANTES de cambiar currentTime
      isSeeking = true
      console.log("✅ isSeeking flag set to TRUE")

      // Parar reproducción antes de seek
      audio.pause()

      // Helper para hacer el seek cuando el audio esté listo
      const performSeek = () => {
        try {
          audio.currentTime = time
          console.log("✅ Seek set audio.currentTime to:", audio.currentTime, "readyState:", audio.readyState)
        } catch (err) {
          console.error("⚠️ Error setting currentTime:", err)
        }
      }

      // Si el audio no está listo (readyState < 2), esperar a que esté listo
      if (audio.readyState < 2) {
        console.log("⏳ Audio not ready yet (readyState:", audio.readyState, "), waiting for canplay...")
        const handleCanPlayForSeek = () => {
          audio.removeEventListener("canplay", handleCanPlayForSeek)
          console.log("✅ Audio ready, now seeking...")
          performSeek()
        }
        audio.addEventListener("canplay", handleCanPlayForSeek)
        // Timeout en caso de que canplay no se dispare
        setTimeout(() => {
          audio.removeEventListener("canplay", handleCanPlayForSeek)
          performSeek()
        }, 500)
      } else {
        // Audio ya está listo, hacer seek inmediatamente
        performSeek()
      }


      // Actualizar store para trigger del useEffect
      store.setCurrentTime(time)

      // Resetear el flag después de 200ms (después de que los eventos se estabilicen)
      const resetTimeout = setTimeout(() => {
        isSeeking = false
        console.log("✅ isSeeking flag reset to FALSE")
      }, 200)

      // Resume si estaba reproduciendo
      if (wasPlaying) {
        let resumeAttempted = false

        const handleCanPlay = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          clearTimeout(resetTimeout)
          clearTimeout(resumeTimeout)

          if (!resumeAttempted) {
            resumeAttempted = true
            console.log("🎬 Resume via canplay after seek")
            audio.play().catch((err) => {
              console.error("❌ Resume play failed:", err?.message || err)
            })
          }
        }

        const handleLoadedMetadata = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          clearTimeout(resetTimeout)
          clearTimeout(resumeTimeout)

          if (!resumeAttempted) {
            resumeAttempted = true
            console.log("🎬 Resume via loadedmetadata after seek")
            audio.play().catch((err) => {
              console.error("❌ Resume play failed:", err?.message || err)
            })
          }
        }

        // Listeners para distintos escenarios
        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)

        // Fallback si no se disparan eventos en 300ms
        const resumeTimeout = setTimeout(() => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          clearTimeout(resetTimeout)

          if (!resumeAttempted) {
            resumeAttempted = true
            console.log("🎬 Resume via timeout after seek")
            isSeeking = false
            audio.play().catch((err) => {
              console.error("❌ Timeout resume failed:", err?.message || err)
            })
          }
        }, 300)
      }
    } catch (e) {
      console.error("⚠️ Seek error:", e)
      isSeeking = false
    }
  }, [])

  return {
    ...store,
    seek,
  }
}
