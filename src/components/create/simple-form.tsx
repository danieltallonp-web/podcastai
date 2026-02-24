"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useCreateStore } from "@/stores/create-store"
import {
  PODCAST_FORMATS,
  DURATION_OPTIONS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/constants"
import { Wand2, Loader2 } from "lucide-react"

export function SimpleForm() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)

  const {
    prompt,
    format,
    duration,
    tone,
    language,
    setPrompt,
    setFormat,
    setDuration,
    setTone,
    setLanguage,
    getConfig,
  } = useCreateStore()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Escribe qué quieres escuchar")
      return
    }

    setGenerating(true)
    try {
      const config = getConfig()

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message ?? "Error al generar")
      }

      const data = await res.json()
      toast.success("¡Podcast en camino!")
      router.push(`/podcast/${data.podcastId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado"
      toast.error(message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-sm font-medium">
          ¿Qué quieres escuchar?
        </Label>
        <Textarea
          id="prompt"
          placeholder="Ej: Un debate sobre si la inteligencia artificial reemplazará a los programadores, con argumentos de ambos lados..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-400">
          Sé tan específico o general como quieras
        </p>
      </div>

      {/* Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Formato</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PODCAST_FORMATS.slice(0, 8).map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                format === f.id
                  ? "border-violet-300 bg-violet-50 text-violet-700 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-xs font-medium">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Duración</Label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDuration(d.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                duration === d.value
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tono</Label>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                tone === t.id
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Idioma</Label>
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

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        size="lg"
        className="w-full gap-2"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            Generar podcast
          </>
        )}
      </Button>
    </div>
  )
}
