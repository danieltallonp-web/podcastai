"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateStore } from "@/stores/create-store"
import {
  MUSIC_STYLES,
  SFX_LEVELS,
  INTRO_STYLES,
  AUDIO_QUALITY_OPTIONS,
} from "@/lib/constants"
import { Music, Volume2, Waves, Play, Pause, Headphones } from "lucide-react"

export function SectionProduction() {
  const {
    musicStyle,
    musicVolume,
    sfxLevel,
    introStyle,
    pauseBetweenSections,
    audioQuality,
    setMusicStyle,
    setMusicVolume,
    setSfxLevel,
    setIntroStyle,
    setPauseBetweenSections,
    setAudioQuality,
  } = useCreateStore()

  return (
    <div className="space-y-6">
      {/* Music Style */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Estilo de musica</Label>
        </div>
        <Select value={musicStyle} onValueChange={setMusicStyle}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar estilo" />
          </SelectTrigger>
          <SelectContent>
            {MUSIC_STYLES.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Music Volume */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Volumen de musica</Label>
        </div>
        <Slider
          value={[musicVolume]}
          onValueChange={(val) => setMusicVolume(val[0])}
          min={0}
          max={100}
          step={5}
          disabled={musicStyle === "none"}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Silencio</span>
          <span className="font-medium text-gray-600">{musicVolume}%</span>
          <span>Maximo</span>
        </div>
      </div>

      {/* SFX Level */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Nivel de efectos de sonido</Label>
        </div>
        <Select value={sfxLevel} onValueChange={setSfxLevel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar nivel" />
          </SelectTrigger>
          <SelectContent>
            {SFX_LEVELS.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Intro Style */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Estilo de intro</Label>
        </div>
        <Select value={introStyle} onValueChange={setIntroStyle}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar estilo" />
          </SelectTrigger>
          <SelectContent>
            {INTRO_STYLES.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                {style.label}
                {style.duration > 0 && (
                  <span className="text-gray-400 ml-1">
                    (~{style.duration}s)
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pause Between Sections */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Pause className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Pausa entre secciones</Label>
        </div>
        <Slider
          value={[pauseBetweenSections]}
          onValueChange={(val) => setPauseBetweenSections(val[0])}
          min={0}
          max={5}
          step={0.5}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Sin pausa</span>
          <span className="font-medium text-gray-600">
            {pauseBetweenSections}s
          </span>
          <span>5 segundos</span>
        </div>
      </div>

      {/* Audio Quality */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Calidad de audio</Label>
        </div>
        <Select value={audioQuality} onValueChange={setAudioQuality}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar calidad" />
          </SelectTrigger>
          <SelectContent>
            {AUDIO_QUALITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label} ({opt.bitrate})
                {"minPlan" in opt && (
                  <span className="text-gray-400 ml-1">
                    - Plan {opt.minPlan}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
