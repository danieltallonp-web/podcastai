"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Heart, Download, Share2, ListPlus, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleFavorite } from "@/actions/podcast"
import { getUserPlaylists, createPlaylist, addToPlaylist } from "@/actions/playlist"
import { toast } from "sonner"
import type { PodcastStatus } from "@prisma/client"

interface PodcastActionsProps {
  podcastId: string
  audioUrl: string | null
  isFavorite: boolean
  status: PodcastStatus
  title: string
  className?: string
}

export function PodcastActions({
  podcastId,
  audioUrl,
  isFavorite: initialFavorite,
  status,
  title,
  className,
}: PodcastActionsProps) {
  const [isFav, setIsFav] = useState(initialFavorite)
  const [isPending, startTransition] = useTransition()
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const [playlists, setPlaylists] = useState<
    Array<{ id: string; name: string; items: Array<{ podcastId: string }> }>
  >([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)

  const handleFavorite = () => {
    setIsFav((prev) => !prev)
    startTransition(async () => {
      try {
        await toggleFavorite(podcastId)
      } catch {
        setIsFav((prev) => !prev)
        toast.error("Error al actualizar favorito")
      }
    })
  }

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/podcast/${podcastId}`
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado al portapapeles")
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  const loadPlaylists = async () => {
    setLoadingPlaylists(true)
    try {
      const data = await getUserPlaylists()
      setPlaylists(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          items: p.items.map((i) => ({ podcastId: i.podcastId })),
        }))
      )
    } catch {
      toast.error("Error al cargar playlists")
    } finally {
      setLoadingPlaylists(false)
    }
  }

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addToPlaylist(playlistId, podcastId)
      toast.success("Añadido a la playlist")
      setPlaylistOpen(false)
    } catch {
      toast.error("Error al añadir a playlist")
    }
  }

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return
    try {
      const playlist = await createPlaylist(newPlaylistName.trim())
      await addToPlaylist(playlist.id, podcastId)
      toast.success(`Añadido a "${newPlaylistName.trim()}"`)
      setNewPlaylistName("")
      setPlaylistOpen(false)
    } catch {
      toast.error("Error al crear playlist")
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Favorite */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleFavorite}
        disabled={isPending}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            isFav ? "fill-red-500 text-red-500" : "text-gray-400"
          )}
        />
      </Button>

      {/* Add to playlist */}
      {status === "READY" && (
        <Dialog
          open={playlistOpen}
          onOpenChange={(open) => {
            setPlaylistOpen(open)
            if (open) loadPlaylists()
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ListPlus className="h-4 w-4 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Añadir a playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {loadingPlaylists ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : playlists.length > 0 ? (
                <div className="max-h-48 space-y-1 overflow-y-auto">
                  {playlists.map((pl) => {
                    const alreadyIn = pl.items.some(
                      (i) => i.podcastId === podcastId
                    )
                    return (
                      <button
                        key={pl.id}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50",
                          alreadyIn && "opacity-50"
                        )}
                        onClick={() => !alreadyIn && handleAddToPlaylist(pl.id)}
                        disabled={alreadyIn}
                      >
                        {pl.name}
                        {alreadyIn && (
                          <span className="ml-2 text-xs text-gray-400">
                            (ya añadido)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="py-2 text-center text-sm text-gray-500">
                  No tienes playlists aún
                </p>
              )}

              {/* Create new */}
              <div className="flex gap-2 border-t pt-3">
                <Input
                  placeholder="Nueva playlist..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleCreateAndAdd}
                  disabled={!newPlaylistName.trim()}
                >
                  <Plus className="h-3 w-3" />
                  Crear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Download */}
      {status === "READY" && audioUrl && (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={audioUrl} download={`${title}.mp3`}>
            <Download className="h-4 w-4 text-gray-400" />
          </a>
        </Button>
      )}

      {/* Share */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4 text-gray-400" />
      </Button>
    </div>
  )
}
