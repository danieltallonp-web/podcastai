"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useCreateStore } from "@/stores/create-store"
import { Plus, X, Link, Search, BookOpen, Clock } from "lucide-react"

const RESEARCH_DEPTH_OPTIONS = [
  {
    id: "basic",
    label: "Basico",
    description: "Resumen general del tema",
    icon: Search,
  },
  {
    id: "intermediate",
    label: "Moderado",
    description: "Investigacion equilibrada con fuentes",
    icon: BookOpen,
  },
  {
    id: "deep",
    label: "Profundo",
    description: "Analisis exhaustivo con multiples perspectivas",
    icon: Search,
  },
] as const

const CONTENT_STRUCTURE_OPTIONS = [
  { id: "auto", label: "Automatica", description: "La IA decide la mejor estructura" },
  { id: "chronological", label: "Cronologica", description: "Orden temporal de los eventos" },
  { id: "thematic", label: "Tematica", description: "Agrupado por temas o subtemas" },
  { id: "qa", label: "Pregunta y respuesta", description: "Formato de Q&A estructurado" },
] as const

export function SectionContent() {
  const {
    detailedPrompt,
    sources,
    researchDepth,
    contentStructure,
    timePeriod,
    setDetailedPrompt,
    setSources,
    setResearchDepth,
    setContentStructure,
    setTimePeriod,
  } = useCreateStore()

  const [newSourceUrl, setNewSourceUrl] = useState("")

  const handleAddSource = () => {
    const url = newSourceUrl.trim()
    if (!url) return
    setSources([...sources, { type: "url", value: url, name: url }])
    setNewSourceUrl("")
  }

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSource()
    }
  }

  return (
    <div className="space-y-6">
      {/* Detailed prompt */}
      <div className="space-y-2">
        <Label htmlFor="detailedPrompt" className="text-sm font-medium">
          Describe tu podcast en detalle
        </Label>
        <Textarea
          id="detailedPrompt"
          placeholder="Describe con todo el detalle que quieras el podcast que deseas. Incluye temas especificos, puntos a tratar, estilo deseado, publico objetivo..."
          value={detailedPrompt}
          onChange={(e) => setDetailedPrompt(e.target.value)}
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-gray-400">
          Cuanto mas detallado sea tu prompt, mejor sera el resultado
        </p>
      </div>

      {/* Sources */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Fuentes (URLs)</Label>
        <p className="text-xs text-gray-400">
          Agrega URLs de articulos, blogs o recursos que quieras como referencia
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="https://ejemplo.com/articulo"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddSource}
            disabled={!newSourceUrl.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {sources.length > 0 && (
          <div className="space-y-2 mt-2">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <Link className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="flex-1 truncate text-sm text-gray-600">
                  {source.value}
                </span>
                <button
                  onClick={() => handleRemoveSource(index)}
                  className="shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research Depth */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Profundidad de investigacion</Label>
        <RadioGroup
          value={researchDepth}
          onValueChange={(val) =>
            setResearchDepth(val as "basic" | "intermediate" | "deep")
          }
          className="grid gap-2"
        >
          {RESEARCH_DEPTH_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all",
                researchDepth === option.id
                  ? "border-violet-300 bg-violet-50 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <RadioGroupItem value={option.id} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Content Structure */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Estructura del contenido</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_STRUCTURE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() =>
                setContentStructure(
                  option.id as "auto" | "chronological" | "thematic" | "qa"
                )
              }
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
                contentStructure === option.id
                  ? "border-violet-300 bg-violet-50 text-violet-700 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Period */}
      <div className="space-y-2">
        <Label htmlFor="timePeriod" className="text-sm font-medium">
          Periodo de tiempo
        </Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="timePeriod"
            placeholder="Ej: Ultima semana, 2024, Siglo XX..."
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-gray-400">
          Opcional: limita la informacion a un periodo especifico
        </p>
      </div>
    </div>
  )
}
