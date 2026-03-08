"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Gauge,
  Loader2,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePlayer } from "@/hooks/use-player"
import { cn } from "@/lib/utils"

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function PlayerBar() {
  // Local drag state — only used while the user is dragging the slider
  const [isDragging, setIsDragging] = useState(false)
  const [dragPercent, setDragPercent] = useState(0)

  const {
    podcast,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLoading,
    togglePlay,
    setVolume,
    setPlaybackRate,
    seek,
  } = usePlayer()

  if (!podcast) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const displayPercent = isDragging ? dragPercent : progressPercent

  // While dragging, just update local state (no seek yet)
  const handleSliderChange = (value: number[]) => {
    setIsDragging(true)
    setDragPercent(value[0])
  }

  // On commit (mouse/touch release), actually seek
  const handleSliderCommit = (value: number[]) => {
    if (duration > 0) {
      const seekTime = (value[0] / 100) * duration
      seek(seekTime)
    }
    setIsDragging(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:left-64">
      <div className="flex h-20 items-center gap-4 px-4">
        {/* Podcast info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {podcast.title}
            </p>
            <p className="truncate text-xs text-gray-500">
              {formatDuration(isDragging ? (dragPercent / 100) * duration : currentTime)}{" "}
              / {formatDuration(duration)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => seek(Math.max(0, currentTime - 15))}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-violet-600 text-white hover:bg-violet-700"
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => seek(Math.min(currentTime + 15, duration))}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="hidden flex-1 md:block">
          <Slider
            value={[displayPercent]}
            max={100}
            step={0.1}
            className="cursor-pointer"
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
          />
        </div>

        {/* Volume & Speed */}
        <div className="hidden items-center gap-2 lg:flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Gauge className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2" side="top">
              <div className="space-y-1">
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    className={cn(
                      "w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100",
                      playbackRate === speed && "bg-violet-100 font-medium text-violet-700"
                    )}
                    onClick={() => setPlaybackRate(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            className="w-20 cursor-pointer"
            onValueChange={(v) => setVolume(v[0] / 100)}
          />
        </div>
      </div>
    </div>
  )
}
