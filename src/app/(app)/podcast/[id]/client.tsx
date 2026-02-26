"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { usePlayerStore } from "@/stores/player-store"
import { usePlayer } from "@/hooks/use-player"
import { GenerationProgress } from "@/components/create/generation-progress"
import { PODCAST_FORMATS, STATUS_LABELS } from "@/lib/constants"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Download,
  Share2,
  Clock,
  Calendar,
  Volume2,
  Gauge,
} from "lucide-react"
import type { PodcastStatus, PodcastFormat } from "@prisma/client"

interface PodcastData {
  id: string
  title: string
  description: string | null
  prompt: string
  format: PodcastFormat
  status: PodcastStatus
  audioUrl: string | null
  durationSeconds: number | null
  listenCount: number
  isFavorite: boolean
  createdAt: string
  language: string
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function PodcastDetailClient({ podcast }: { podcast: PodcastData }) {
  const { podcast: currentPodcast, isPlaying, currentTime, duration, setPodcast, play, pause, togglePlay } =
    usePlayerStore()
  const { seek } = usePlayer()

  const isThisPodcastPlaying =
    currentPodcast?.id === podcast.id && isPlaying

  const isDuration = currentPodcast?.id === podcast.id ? duration : (podcast.durationSeconds ?? 0)
  const isCurrent = currentPodcast?.id === podcast.id ? currentTime : 0
  const progressPercent = isDuration > 0 ? (isCurrent / isDuration) * 100 : 0

  const formatInfo = PODCAST_FORMATS.find(
    (f) => f.id === podcast.format.toLowerCase()
  )

  // If still generating, show progress
  if (podcast.status !== "READY" && podcast.status !== "FAILED") {
    return <GenerationProgress podcastId={podcast.id} />
  }

  const handlePlay = () => {
    if (currentPodcast?.id === podcast.id) {
      togglePlay()
    } else if (podcast.audioUrl) {
      setPodcast({
        id: podcast.id,
        title: podcast.title,
        audioUrl: podcast.audioUrl,
        durationSeconds: podcast.durationSeconds ?? 0,
        format: podcast.format,
      })
      play()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          {formatInfo && <span className="text-2xl">{formatInfo.icon}</span>}
          <Badge variant="secondary">{formatInfo?.label ?? podcast.format}</Badge>
          <Badge variant="outline" className="text-xs">
            {podcast.language.toUpperCase()}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{podcast.title}</h1>

        {podcast.description && (
          <p className="mt-2 text-gray-600">{podcast.description}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
          {podcast.durationSeconds && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(podcast.durationSeconds)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(podcast.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Player */}
      {podcast.status === "READY" && podcast.audioUrl && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          {/* Main controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                const state = usePlayerStore.getState()
                const newTime = Math.max(0, state.currentTime - 15)
                seek(newTime)
              }}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-violet-600 text-white hover:bg-violet-700"
              onClick={handlePlay}
            >
              {isThisPodcastPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="ml-0.5 h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                const state = usePlayerStore.getState()
                const newTime = Math.min(state.currentTime + 15, state.duration)
                seek(newTime)
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            {/* Visual progress bar (read-only) */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Time display */}
            <div className="mt-3 flex justify-between text-sm text-gray-600 font-medium">
              <span>{formatDuration(isCurrent)}</span>
              <span>
                {isDuration
                  ? formatDuration(isDuration)
                  : "--:--"}
              </span>
            </div>

            {/* Info message */}
            <p className="mt-2 text-center text-xs text-gray-400">
              Usa los botones para saltar ⏮ -15s | +15s ⏭
            </p>
          </div>

          {/* Secondary controls */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Gauge className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Failed state */}
      {podcast.status === "FAILED" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Hubo un error generando este podcast
          </p>
          <p className="mt-1 text-sm text-red-500">
            Puedes intentar crearlo de nuevo desde el formulario.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          <Heart className="h-4 w-4" />
          Favorito
        </Button>
        {podcast.audioUrl && (
          <Button variant="outline" className="gap-2" asChild>
            <a href={podcast.audioUrl} download>
              <Download className="h-4 w-4" />
              Descargar
            </a>
          </Button>
        )}
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </div>

      {/* Prompt used */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          Prompt original
        </h3>
        <p className="text-sm text-gray-600">{podcast.prompt}</p>
      </div>
    </div>
  )
}
