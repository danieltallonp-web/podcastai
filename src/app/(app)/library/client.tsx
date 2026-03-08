"use client"

import { PodcastCard } from "@/components/podcast/podcast-card"
import { PodcastActions } from "@/components/podcast/podcast-actions"
import { usePlayerStore } from "@/stores/player-store"
import { toggleFavorite } from "@/actions/podcast"
import { Headphones, Heart, ListMusic, Music } from "lucide-react"
import Link from "next/link"
import type { PodcastStatus, PodcastFormat } from "@prisma/client"

interface Podcast {
  id: string
  title: string
  description: string | null
  format: PodcastFormat
  status: PodcastStatus
  durationSeconds: number | null
  listenCount: number
  isFavorite: boolean
  createdAt: string
  audioUrl: string | null
}

interface Playlist {
  id: string
  name: string
  description: string | null
  items: Array<{
    id: string
    podcast: Podcast
  }>
}

interface LibraryClientProps {
  podcasts?: Podcast[]
  playlists?: Playlist[]
  variant: "all" | "favorites" | "playlists"
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
      <Icon className="h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}

export function LibraryClient({
  podcasts,
  playlists,
  variant,
}: LibraryClientProps) {
  const { setPodcast, setIsPlaying } = usePlayerStore()

  const handlePlay = (podcast: Podcast) => {
    if (podcast.audioUrl && podcast.status === "READY") {
      setPodcast({
        id: podcast.id,
        title: podcast.title,
        audioUrl: podcast.audioUrl,
        durationSeconds: podcast.durationSeconds ?? 0,
        format: podcast.format,
      })
      setIsPlaying(true)
    }
  }

  if (variant === "playlists") {
    if (!playlists || playlists.length === 0) {
      return (
        <EmptyState
          icon={ListMusic}
          title="Sin playlists"
          description="Crea tu primera playlist desde las acciones de un podcast"
        />
      )
    }

    return (
      <div className="space-y-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-sm text-gray-500">
                    {playlist.description}
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {playlist.items.length} podcast
                {playlist.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {playlist.items.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {playlist.items.map((item) => (
                  <div key={item.id} className="relative">
                    <PodcastCard
                      {...item.podcast}
                      createdAt={new Date(item.podcast.createdAt)}
                      onPlay={() => handlePlay(item.podcast)}
                      onToggleFavorite={() =>
                        toggleFavorite(item.podcast.id)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">
                Playlist vacía
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  // All / Favorites
  if (!podcasts || podcasts.length === 0) {
    return (
      <EmptyState
        icon={variant === "favorites" ? Heart : Music}
        title={
          variant === "favorites"
            ? "Sin favoritos"
            : "Sin podcasts"
        }
        description={
          variant === "favorites"
            ? "Marca podcasts como favoritos para verlos aquí"
            : "Crea tu primer podcast para empezar"
        }
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {podcasts.map((podcast) => (
        <div key={podcast.id} className="group flex flex-col">
          <PodcastCard
            {...podcast}
            createdAt={new Date(podcast.createdAt)}
            onPlay={() => handlePlay(podcast)}
            onToggleFavorite={() => toggleFavorite(podcast.id)}
          />
          {/* Actions row below card - shows on hover */}
          <div className="mt-2 flex items-center justify-end gap-1 transition-opacity duration-200 opacity-60 group-hover:opacity-100">
            <PodcastActions
              podcastId={podcast.id}
              audioUrl={podcast.audioUrl}
              isFavorite={podcast.isFavorite}
              status={podcast.status}
              title={podcast.title}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
