"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useCreateStore } from "@/stores/create-store"
import {
  PODCAST_FORMATS,
  ADVANCED_TONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/constants"
import { Languages, Sparkles } from "lucide-react"

export function SectionFormat() {
  const {
    format,
    advancedTones,
    duration,
    language,
    mixLanguages,
    interactivityLevel,
    setFormat,
    setFormatWithVoices,
    setAdvancedTones,
    setDuration,
    setLanguage,
    setMixLanguages,
    setInteractivityLevel,
  } = useCreateStore()

  const toggleTone = (toneId: string) => {
    if (advancedTones.includes(toneId)) {
      setAdvancedTones(advancedTones.filter((t) => t !== toneId))
    } else {
      setAdvancedTones([...advancedTones, toneId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Format selector - all 8 options */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Formato del podcast</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PODCAST_FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatWithVoices(f.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                format === f.id
                  ? "border-violet-300 bg-violet-50 text-violet-700 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-xs font-medium">{f.label}</span>
              <span className="text-[10px] text-gray-400">{f.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Tones - multi-select chips */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Tonos <span className="text-xs text-gray-400 font-normal">(puedes seleccionar varios)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {ADVANCED_TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTone(t.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                advancedTones.includes(t.id)
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration - custom number input */}
      <div className="space-y-2">
        <Label htmlFor="customDuration" className="text-sm font-medium">
          Duracion (minutos)
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="customDuration"
            type="number"
            min={1}
            max={90}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-500">min</span>
          <div className="flex-1">
            <Slider
              value={[duration]}
              onValueChange={(val) => setDuration(val[0])}
              min={1}
              max={90}
              step={1}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Entre 1 y 90 minutos
        </p>
      </div>

      {/* Language selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Idioma principal</Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                language === l.id
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mix languages toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <Languages className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Mezclar idiomas</p>
            <p className="text-xs text-gray-500">
              Permite que el podcast alterne entre idiomas
            </p>
          </div>
        </div>
        <Switch
          checked={mixLanguages}
          onCheckedChange={setMixLanguages}
        />
      </div>

      {/* Interactivity level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Nivel de interactividad</Label>
        </div>
        <Slider
          value={[interactivityLevel]}
          onValueChange={(val) => setInteractivityLevel(val[0])}
          min={0}
          max={10}
          step={1}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Lineal (0)</span>
          <span className="font-medium text-gray-600">{interactivityLevel}</span>
          <span>Muy interactivo (10)</span>
        </div>
        <p className="text-xs text-gray-400">
          Controla cuanto puede el oyente influir en la narrativa
        </p>
      </div>
    </div>
  )
}
