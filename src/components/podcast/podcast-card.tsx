"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Heart, Clock, Headphones } from "lucide-react"
import { PODCAST_FORMATS, STATUS_LABELS } from "@/lib/constants"
import type { PodcastStatus, PodcastFormat } from "@prisma/client"

interface PodcastCardProps {
  id: string
  title: string
  description?: string | null
  format: PodcastFormat
  status: PodcastStatus
  durationSeconds?: number | null
  listenCount: number
  isFavorite: boolean
  createdAt: Date
  onPlay?: () => void
  onToggleFavorite?: () => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function PodcastCard({
  id,
  title,
  description,
  format,
  status,
  durationSeconds,
  listenCount,
  isFavorite,
  createdAt,
  onPlay,
  onToggleFavorite,
}: PodcastCardProps) {
  const formatInfo = PODCAST_FORMATS.find((f) => f.id === format.toLowerCase())
  const statusInfo = STATUS_LABELS[status]

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />

      <div className="flex flex-1 flex-col p-4">
        {/* Status / Format */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {formatInfo && (
              <span className="text-lg" title={formatInfo.label}>
                {formatInfo.icon}
              </span>
            )}
            <Badge variant="secondary" className="text-xs">
              {formatInfo?.label ?? format}
            </Badge>
          </div>

          {status !== "READY" && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs whitespace-nowrap",
                status === "FAILED"
                  ? "border-red-200 text-red-600"
                  : "border-violet-200 text-violet-600"
              )}
            >
              {statusInfo?.label ?? status}
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link href={`/podcast/${id}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-violet-700">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="mb-3 line-clamp-2 text-xs text-gray-500">
            {description}
          </p>
        )}

        {/* Metadata */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {durationSeconds && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(durationSeconds)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Headphones className="h-3 w-3" />
            {listenCount}
          </span>
          <span>
            {new Date(createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Actions - pushed to bottom */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          {status === "READY" && (
            <Button
              size="sm"
              className="h-8 flex-1 gap-1.5 text-xs"
              onClick={onPlay}
            >
              <Play className="h-3 w-3" />
              Reproducir
            </Button>
          )}

          {status === "READY" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                )}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
