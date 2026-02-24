"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { createPreset, deletePreset } from "@/actions/preset"
import { PODCAST_FORMATS, TONE_OPTIONS } from "@/lib/constants"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wand2, Trash2, Plus, Sparkles, Settings2 } from "lucide-react"

interface Preset {
  id: string
  name: string
  description: string | null
  icon: string | null
  config: Record<string, unknown>
  isSystem: boolean
  createdAt: string
}

interface PresetsClientProps {
  systemPresets: Preset[]
  userPresets: Preset[]
}

export function PresetsClient({ systemPresets, userPresets }: PresetsClientProps) {
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newIcon, setNewIcon] = useState("")
  const [newFormat, setNewFormat] = useState("")
  const [newTone, setNewTone] = useState("")

  const handleDelete = (presetId: string, presetName: string) => {
    startTransition(async () => {
      try {
        await deletePreset(presetId)
        toast.success(`Preset "${presetName}" eliminado`)
      } catch {
        toast.error("Error al eliminar el preset")
      }
    })
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    startTransition(async () => {
      try {
        const config: Record<string, unknown> = {}
        if (newFormat) config.format = newFormat
        if (newTone) config.tone = [newTone]

        await createPreset({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
          icon: newIcon || undefined,
          config,
        })

        toast.success("Preset creado correctamente")
        setDialogOpen(false)
        setNewName("")
        setNewDescription("")
        setNewIcon("")
        setNewFormat("")
        setNewTone("")
      } catch {
        toast.error("Error al crear el preset")
      }
    })
  }

  return (
    <div className="space-y-10">
      {/* System presets */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Presets del sistema
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {systemPresets.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{preset.icon ?? "🎙️"}</span>
                  <h3 className="font-semibold text-gray-900">{preset.name}</h3>
                </div>
                {preset.description && (
                  <p className="mb-4 text-sm text-gray-500">
                    {preset.description}
                  </p>
                )}
              </div>
              <Link href={`/create?presetId=${preset.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Usar
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* User presets */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Mis presets
            </h2>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo preset</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <Input
                    placeholder="Ej: Mi resumen diario"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <Textarea
                    placeholder="Describe brevemente este preset..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Icono
                  </label>
                  <Select value={newIcon} onValueChange={setNewIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un icono" />
                    </SelectTrigger>
                    <SelectContent>
                      {["🎙️", "📰", "☕", "🔍", "⚔️", "🌙", "📡", "🎓", "🎬", "🎧", "💡", "🚀"].map(
                        (icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Formato
                  </label>
                  <Select value={newFormat} onValueChange={setNewFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {PODCAST_FORMATS.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.icon} {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tono
                  </label>
                  <Select value={newTone} onValueChange={setNewTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un tono" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          {tone.icon} {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={isPending || !newName.trim()}
                  className="w-full"
                >
                  {isPending ? "Creando..." : "Crear preset"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {userPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
            <Settings2 className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              Aún no tienes presets personalizados
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Crea tu primer preset para agilizar la generación de podcasts
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userPresets.map((preset) => (
              <div
                key={preset.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{preset.icon ?? "🎙️"}</span>
                    <h3 className="font-semibold text-gray-900">
                      {preset.name}
                    </h3>
                  </div>
                  {preset.description && (
                    <p className="mb-4 text-sm text-gray-500">
                      {preset.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/create?presetId=${preset.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Usar
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(preset.id, preset.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
