"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import { useCreateStore } from "@/stores/create-store"
import { SectionContent } from "@/components/create/section-content"
import { SectionFormat } from "@/components/create/section-format"
import { SectionVoices } from "@/components/create/section-voices"
import { SectionProduction } from "@/components/create/section-production"
import { SectionStory } from "@/components/create/section-story"
import { SectionOutput } from "@/components/create/section-output"
import {
  Wand2,
  Loader2,
  FileText,
  Palette,
  Mic,
  Sliders,
  BookHeart,
  Download,
} from "lucide-react"

const SECTIONS = [
  {
    id: "content",
    label: "Contenido y estructura",
    description: "Prompt detallado, fuentes, profundidad",
    icon: FileText,
  },
  {
    id: "format",
    label: "Formato y narrativa",
    description: "Formato, tonos, idioma, interactividad",
    icon: Palette,
  },
  {
    id: "voices",
    label: "Voces",
    description: "Numero y configuracion de voces",
    icon: Mic,
  },
  {
    id: "production",
    label: "Produccion",
    description: "Musica, efectos, intro, calidad",
    icon: Sliders,
  },
  {
    id: "story",
    label: "Personalizacion de historia",
    description: "Personajes, ambientacion, tension",
    icon: BookHeart,
  },
  {
    id: "output",
    label: "Formato de salida",
    description: "Formato de archivo, transcripcion, extras",
    icon: Download,
  },
] as const

export function AdvancedForm() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const { detailedPrompt, getConfig } = useCreateStore()

  const handleGenerate = async () => {
    if (!detailedPrompt.trim()) {
      toast.error("Escribe una descripcion de tu podcast en la seccion de Contenido")
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
      toast.success("Podcast en camino!")
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
      <Accordion type="multiple" defaultValue={["content"]} className="space-y-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="rounded-xl border border-gray-200 bg-white px-4 last:border-b"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {section.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-5">
                {section.id === "content" && <SectionContent />}
                {section.id === "format" && <SectionFormat />}
                {section.id === "voices" && <SectionVoices />}
                {section.id === "production" && <SectionProduction />}
                {section.id === "story" && <SectionStory />}
                {section.id === "output" && <SectionOutput />}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generating || !detailedPrompt.trim()}
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
