"use client"

import { PodcastCard } from "@/components/podcast/podcast-card"
import { Headphones } from "lucide-react"
import type { PodcastStatus, PodcastFormat } from "@prisma/client"

interface PodcastData {
  id: string
  title: string
  description: string | null
  format: PodcastFormat
  status: PodcastStatus
  durationSeconds: number | null
  listenCount: number
  isFavorite: boolean
  createdAt: Date
}

interface RecentPodcastsProps {
  podcasts: PodcastData[]
}

export function RecentPodcasts({ podcasts }: RecentPodcastsProps) {
  if (podcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
        <Headphones className="mb-4 h-12 w-12 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900">
          Aún no tienes podcasts
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Crea tu primer podcast y aparecerá aquí.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        Tus podcasts recientes
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            {...podcast}
          />
        ))}
      </div>
    </div>
  )
}
