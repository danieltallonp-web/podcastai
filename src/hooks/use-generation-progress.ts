"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { GenerationProgress } from "@/types"
import type { PodcastStatus } from "@prisma/client"

const STATUS_ORDER: PodcastStatus[] = [
  "QUEUED",
  "RESEARCHING",
  "SCRIPTING",
  "GENERATING_AUDIO",
  "POST_PRODUCING",
  "READY",
]

function getProgressPercentage(status: PodcastStatus): number {
  const index = STATUS_ORDER.indexOf(status)
  if (index === -1) return 0
  return Math.round((index / (STATUS_ORDER.length - 1)) * 100)
}

export function useGenerationProgress(podcastId: string | null) {
  const [progress, setProgress] = useState<GenerationProgress>({
    status: "QUEUED",
    step: 0,
    totalSteps: 5,
    message: "En cola...",
    percentage: 0,
  })
  const [isComplete, setIsComplete] = useState(false)
  const [isFailed, setIsFailed] = useState(false)

  const updateFromStatus = useCallback((status: string, message?: string) => {
    const podcastStatus = status as PodcastStatus
    const step = STATUS_ORDER.indexOf(podcastStatus)

    const statusMessages: Record<string, string> = {
      QUEUED: "En cola...",
      RESEARCHING: "Investigando sobre el tema...",
      SCRIPTING: "Escribiendo el guion...",
      GENERATING_AUDIO: "Generando las voces...",
      POST_PRODUCING: "Produciendo el audio final...",
      READY: "¡Tu podcast está listo!",
      FAILED: "Hubo un error en la generación",
    }

    setProgress({
      status: podcastStatus,
      step: Math.max(step, 0),
      totalSteps: 5,
      message: message ?? statusMessages[status] ?? "Procesando...",
      percentage: getProgressPercentage(podcastStatus),
    })

    if (status === "READY") setIsComplete(true)
    if (status === "FAILED") setIsFailed(true)
  }, [])

  useEffect(() => {
    if (!podcastId) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel(`podcast:${podcastId}`)
      .on("broadcast", { event: "progress" }, (payload) => {
        const { status, message } = payload.payload as {
          status: string
          message?: string
        }
        updateFromStatus(status, message)
      })
      .subscribe()

    // Also poll the database as fallback
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/podcast/${podcastId}/status`)
        if (res.ok) {
          const data = await res.json()
          updateFromStatus(data.status)

          if (data.status === "READY" || data.status === "FAILED") {
            clearInterval(pollInterval)
          }
        }
      } catch {
        // Silently ignore poll errors
      }
    }, 5000)

    return () => {
      channel.unsubscribe()
      clearInterval(pollInterval)
    }
  }, [podcastId, updateFromStatus])

  return { progress, isComplete, isFailed }
}
