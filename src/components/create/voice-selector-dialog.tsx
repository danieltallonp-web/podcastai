"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle } from "lucide-react"
import { getAllSpanishVoices, getVoicesByGender } from "@/lib/spanish-voices"
import type { SpanishVoiceProfile } from "@/lib/spanish-voices"

interface VoiceSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (voice: SpanishVoiceProfile) => void
  currentVoiceId?: string
  title?: string
}

export function VoiceSelectorDialog({
  open,
  onOpenChange,
  onSelect,
  currentVoiceId,
  title = "Selecciona una voz española",
}: VoiceSelectorDialogProps) {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(currentVoiceId || null)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)

  const allVoices = getAllSpanishVoices()
  const maleVoices = getVoicesByGender("male")
  const femaleVoices = getVoicesByGender("female")

  const handleSelectVoice = (voice: SpanishVoiceProfile) => {
    setSelectedVoiceId(voice.voiceId)
    onSelect(voice)
  }

  const handlePlayPreview = async (voiceId: string) => {
    setPlayingVoiceId(voiceId)
    // Aquí se podría integrar con la API de previsualización de ElevenLabs
    setTimeout(() => setPlayingVoiceId(null), 1000)
  }

  const VoiceCard = ({ voice }: { voice: SpanishVoiceProfile }) => (
    <button
      onClick={() => handleSelectVoice(voice)}
      className={`group relative w-full rounded-lg border-2 p-4 text-left transition-all ${
        selectedVoiceId === voice.voiceId
          ? "border-violet-500 bg-violet-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Selected indicator */}
      {selectedVoiceId === voice.voiceId && (
        <div className="absolute right-3 top-3">
          <CheckCircle className="h-5 w-5 text-violet-500" />
        </div>
      )}

      {/* Voice info */}
      <div className="mb-3 pr-6">
        <h4 className="font-semibold text-gray-900">{voice.name}</h4>
        <p className="text-xs text-gray-600">{voice.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {voice.personality.map((p) => (
          <Badge key={p} variant="secondary" className="text-xs">
            {p}
          </Badge>
        ))}
      </div>

      {/* Best for */}
      <div className="mt-3 border-t border-gray-100 pt-2">
        <p className="text-xs font-medium text-gray-700 mb-1">Ideal para:</p>
        <div className="flex flex-wrap gap-1">
          {voice.bestFor.slice(0, 3).map((format) => (
            <span key={format} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {format}
            </span>
          ))}
        </div>
      </div>

      {/* Play button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-3 gap-1.5 w-full"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayPreview(voice.voiceId)
        }}
        disabled={playingVoiceId === voice.voiceId}
      >
        <Play className="h-3.5 w-3.5" />
        {playingVoiceId === voice.voiceId ? "Reproduciéndose..." : "Escuchar muestra"}
      </Button>
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Selecciona una voz española profesional para tu podcast. Puedes escuchar una muestra
            antes de elegir.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas ({allVoices.length})</TabsTrigger>
            <TabsTrigger value="male">Hombres ({maleVoices.length})</TabsTrigger>
            <TabsTrigger value="female">Mujeres ({femaleVoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {allVoices.map((voice) => (
                <VoiceCard key={voice.voiceId} voice={voice} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="male" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {maleVoices.map((voice) => (
                <VoiceCard key={voice.voiceId} voice={voice} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="female" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {femaleVoices.map((voice) => (
                <VoiceCard key={voice.voiceId} voice={voice} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={!selectedVoiceId}
          >
            Confirmar selección
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
