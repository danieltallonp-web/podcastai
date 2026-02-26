"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateStore } from "@/stores/create-store"
import { Mic, User } from "lucide-react"
import { VoiceSelectorDialog } from "./voice-selector-dialog"
import { getVoiceForFormat, SPANISH_VOICES } from "@/lib/spanish-voices"
import type { SpanishVoiceProfile } from "@/lib/spanish-voices"

export function SectionVoices() {
  const {
    numberOfVoices,
    voices,
    format,
    setNumberOfVoices,
    setVoices,
  } = useCreateStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0)

  const handleNumberChange = (value: number) => {
    const clamped = Math.min(6, Math.max(1, value))
    setNumberOfVoices(clamped)

    // Adjust voices array to match the new count
    if (clamped > voices.length) {
      const newVoices = [...voices]
      for (let i = voices.length; i < clamped; i++) {
        // Try to assign a suitable voice from Spanish voices
        const suggestedVoice = getVoiceForFormat(format || "MONOLOGUE")
        newVoices.push({
          voiceId: suggestedVoice?.voiceId || "",
          name: suggestedVoice?.name || `Voz ${i + 1}`,
          role: "",
          personality: "",
        })
      }
      setVoices(newVoices)
    } else if (clamped < voices.length) {
      setVoices(voices.slice(0, clamped))
    }
  }

  const handleSelectVoice = (voice: SpanishVoiceProfile) => {
    const updated = [...voices]
    if (!updated[selectedVoiceIndex]) {
      updated[selectedVoiceIndex] = {
        voiceId: "",
        name: "",
        role: "",
      }
    }
    updated[selectedVoiceIndex] = {
      ...updated[selectedVoiceIndex],
      voiceId: voice.voiceId,
      name: voice.name,
    }
    setVoices(updated)
    setDialogOpen(false)
  }

  const openVoiceSelector = (index: number) => {
    setSelectedVoiceIndex(index)
    setDialogOpen(true)
  }

  // Generate voice slots based on numberOfVoices
  const voiceSlots = Array.from({ length: numberOfVoices }, (_, i) => {
    const voice = voices[i]
    const spanishVoice = voice?.voiceId ? SPANISH_VOICES[Object.keys(SPANISH_VOICES).find(k => SPANISH_VOICES[k as keyof typeof SPANISH_VOICES].voiceId === voice.voiceId) || ""] : null

    return {
      index: i,
      name: voice?.name || `Voz ${i + 1}`,
      voiceId: voice?.voiceId || "",
      role: voice?.role || "",
      profile: spanishVoice,
    }
  })

  return (
    <div className="space-y-6">
      {/* Number of voices */}
      <div className="space-y-2">
        <Label htmlFor="numberOfVoices" className="text-sm font-medium">
          Número de voces
        </Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleNumberChange(numberOfVoices - 1)}
            disabled={numberOfVoices <= 1}
          >
            -
          </Button>
          <Input
            id="numberOfVoices"
            type="number"
            min={1}
            max={6}
            value={numberOfVoices}
            onChange={(e) => handleNumberChange(Number(e.target.value))}
            className="w-16 text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleNumberChange(numberOfVoices + 1)}
            disabled={numberOfVoices >= 6}
          >
            +
          </Button>
          <span className="text-sm text-gray-500">
            {numberOfVoices === 1 ? "voz" : "voces"}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Entre 1 y 6 voces españolas profesionales
        </p>
      </div>

      {/* Voice configuration cards */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Configuración de voces</Label>
        <div className="grid gap-3">
          {voiceSlots.map((slot) => (
            <div
              key={slot.index}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {slot.name || `Voz ${slot.index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.voiceId
                        ? slot.profile?.description || "Voz española configurada"
                        : "Sin voz asignada - haz clic para seleccionar"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={slot.voiceId ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => openVoiceSelector(slot.index)}
                >
                  <Mic className="h-3.5 w-3.5" />
                  {slot.voiceId ? "Cambiar voz" : "Seleccionar voz"}
                </Button>
              </div>

              {/* Role input */}
              <div>
                <Input
                  placeholder="Rol (ej: presentador, experto, narrador...)"
                  value={slot.role}
                  onChange={(e) => {
                    const updated = [...voices]
                    if (!updated[slot.index]) {
                      updated[slot.index] = {
                        voiceId: "",
                        name: `Voz ${slot.index + 1}`,
                      }
                    }
                    updated[slot.index] = {
                      ...updated[slot.index],
                      role: e.target.value,
                    }
                    setVoices(updated)
                  }}
                  className="text-sm"
                />
              </div>

              {/* Voice tags if selected */}
              {slot.profile && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {slot.profile.personality.map((p) => (
                    <span
                      key={p}
                      className="inline-block text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Voice selector dialog */}
      <VoiceSelectorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleSelectVoice}
        currentVoiceId={voiceSlots[selectedVoiceIndex]?.voiceId}
        title={`Selecciona voz para ${voiceSlots[selectedVoiceIndex]?.name || `Voz ${selectedVoiceIndex + 1}`}`}
      />

      {/* Info box */}
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <div className="flex gap-2">
          <Mic className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-emerald-800">
              Voces españolas profesionales
            </p>
            <p className="text-xs text-emerald-700">
              Todas las voces están optimizadas para podcasts en español. Puedes escuchar
              muestras de cada voz antes de seleccionar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
