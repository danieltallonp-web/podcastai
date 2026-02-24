"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useCreateStore } from "@/stores/create-store"
import { STORY_SETTINGS, STORY_THEMES } from "@/lib/constants"
import { User, Users, MapPin, BookOpen, Gauge, X } from "lucide-react"

const TENSION_OPTIONS = [
  { value: "very_soft", label: "Muy suave", numericValue: 1 },
  { value: "soft", label: "Suave", numericValue: 4 },
  { value: "moderate", label: "Moderado", numericValue: 6 },
  { value: "intense", label: "Intenso", numericValue: 10 },
] as const

export function SectionStory() {
  const { storyConfig, setStoryConfig } = useCreateStore()
  const [characterInput, setCharacterInput] = useState("")

  const characters = storyConfig.secondaryCharacters ?? []

  const handleAddCharacter = () => {
    const name = characterInput.trim()
    if (!name) return
    setStoryConfig({
      secondaryCharacters: [
        ...characters,
        { name, relation: "" },
      ],
    })
    setCharacterInput("")
  }

  const handleRemoveCharacter = (index: number) => {
    setStoryConfig({
      secondaryCharacters: characters.filter((_, i) => i !== index),
    })
  }

  const handleCharacterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCharacter()
    } else if (e.key === "," && characterInput.trim()) {
      e.preventDefault()
      handleAddCharacter()
    }
  }

  const getCharacterName = (char: { name: string; relation: string } | string): string => {
    if (typeof char === "string") return char
    return char.name
  }

  return (
    <div className="space-y-6">
      {/* Protagonist Name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Label htmlFor="protagonistName" className="text-sm font-medium">
            Nombre del protagonista
          </Label>
        </div>
        <Input
          id="protagonistName"
          placeholder="Ej: Luna, Max, Sofia..."
          value={storyConfig.protagonistName ?? ""}
          onChange={(e) =>
            setStoryConfig({ protagonistName: e.target.value })
          }
        />
      </div>

      {/* Protagonist Age */}
      <div className="space-y-2">
        <Label htmlFor="protagonistAge" className="text-sm font-medium">
          Edad del protagonista
        </Label>
        <Input
          id="protagonistAge"
          type="number"
          placeholder="Ej: 8, 12, 25..."
          value={storyConfig.protagonistAge ?? ""}
          onChange={(e) =>
            setStoryConfig({
              protagonistAge: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      {/* Secondary Characters - tags input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Personajes secundarios</Label>
        </div>
        <Input
          placeholder="Escribe un nombre y pulsa Enter o coma para agregar"
          value={characterInput}
          onChange={(e) => setCharacterInput(e.target.value)}
          onKeyDown={handleCharacterKeyDown}
        />
        {characters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {characters.map((char, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-700"
              >
                {getCharacterName(char)}
                <button
                  onClick={() => handleRemoveCharacter(index)}
                  className="rounded-full p-0.5 hover:bg-violet-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">
          Separa los nombres con Enter o coma
        </p>
      </div>

      {/* Setting */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Ambientacion</Label>
        </div>
        <Select
          value={storyConfig.setting ?? ""}
          onValueChange={(val) => setStoryConfig({ setting: val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar ambientacion" />
          </SelectTrigger>
          <SelectContent>
            {STORY_SETTINGS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="mr-1">{s.icon}</span>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Tematica / Moraleja</Label>
        </div>
        <Select
          value={storyConfig.themes?.[0] ?? ""}
          onValueChange={(val) => setStoryConfig({ themes: [val] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar tematica" />
          </SelectTrigger>
          <SelectContent>
            {STORY_THEMES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tension Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Nivel de tension</Label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TENSION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setStoryConfig({
                  tensionLevel: option.value as "very_soft" | "soft" | "moderate" | "intense",
                })
              }
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                storyConfig.tensionLevel === option.value
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Controla la intensidad dramatica de la historia
        </p>
      </div>
    </div>
  )
}
