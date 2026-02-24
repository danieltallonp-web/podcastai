"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateStore } from "@/stores/create-store"
import { Mic, Plus, User } from "lucide-react"

export function SectionVoices() {
  const {
    numberOfVoices,
    voices,
    setNumberOfVoices,
    setVoices,
  } = useCreateStore()

  const handleNumberChange = (value: number) => {
    const clamped = Math.min(6, Math.max(1, value))
    setNumberOfVoices(clamped)

    // Adjust voices array to match the new count
    if (clamped > voices.length) {
      const newVoices = [...voices]
      for (let i = voices.length; i < clamped; i++) {
        newVoices.push({
          voiceId: "",
          name: `Voz ${i + 1}`,
          role: "",
          personality: "",
        })
      }
      setVoices(newVoices)
    } else if (clamped < voices.length) {
      setVoices(voices.slice(0, clamped))
    }
  }

  // Generate voice slots based on numberOfVoices
  const voiceSlots = Array.from({ length: numberOfVoices }, (_, i) => {
    const voice = voices[i]
    return {
      index: i,
      name: voice?.name || `Voz ${i + 1}`,
      voiceId: voice?.voiceId || "",
      role: voice?.role || "",
    }
  })

  return (
    <div className="space-y-6">
      {/* Number of voices */}
      <div className="space-y-2">
        <Label htmlFor="numberOfVoices" className="text-sm font-medium">
          Numero de voces
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
          Entre 1 y 6 voces por podcast
        </p>
      </div>

      {/* Voice configuration cards */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Configuracion de voces</Label>
        <div className="grid gap-3">
          {voiceSlots.map((slot) => (
            <div
              key={slot.index}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {slot.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.voiceId
                        ? "Voz configurada"
                        : "Sin voz asignada"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Seleccionar voz
                </Button>
              </div>

              {/* Role input */}
              <div className="mt-3">
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
            </div>
          ))}
        </div>
      </div>

      {/* Helper text */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="flex gap-2">
          <Mic className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-700">
              Selector de voces
            </p>
            <p className="text-xs text-blue-600">
              Proximamente podras previsualizar y seleccionar entre docenas de
              voces de IA, incluida la clonacion de tu propia voz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
