"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useCreateStore } from "@/stores/create-store"
import { FileAudio, FileText, FileCode, Video, Scissors } from "lucide-react"

const OUTPUT_FORMAT_OPTIONS = [
  { id: "mp3", label: "MP3", description: "Compatible con todo, tamano reducido" },
  { id: "wav", label: "WAV", description: "Sin compresion, maxima calidad" },
  { id: "flac", label: "FLAC", description: "Sin perdida, tamano moderado" },
] as const

export function SectionOutput() {
  const {
    outputFormat,
    includeTranscript,
    exportScript,
    generateVideo,
    generateClips,
    setOutputFormat,
    setIncludeTranscript,
    setExportScript,
    setGenerateVideo,
    setGenerateClips,
  } = useCreateStore()

  return (
    <div className="space-y-6">
      {/* Output Format */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileAudio className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Formato de salida</Label>
        </div>
        <RadioGroup
          value={outputFormat}
          onValueChange={setOutputFormat}
          className="grid gap-2"
        >
          {OUTPUT_FORMAT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all",
                outputFormat === option.id
                  ? "border-violet-300 bg-violet-50 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <RadioGroupItem value={option.id} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {option.label}
                </p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Toggle options */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Opciones adicionales</Label>
        <div className="mt-2 space-y-0 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {/* Include Transcript */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Incluir transcripcion
                </p>
                <p className="text-xs text-gray-500">
                  Genera un archivo de texto con todo el contenido
                </p>
              </div>
            </div>
            <Switch
              checked={includeTranscript}
              onCheckedChange={setIncludeTranscript}
            />
          </div>

          {/* Export Script */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <FileCode className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Exportar guion
                </p>
                <p className="text-xs text-gray-500">
                  Descarga el guion completo con indicaciones de produccion
                </p>
              </div>
            </div>
            <Switch
              checked={exportScript}
              onCheckedChange={setExportScript}
            />
          </div>

          {/* Generate Video */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Generar video
                </p>
                <p className="text-xs text-gray-500">
                  Crea un video con visualizaciones para redes sociales
                </p>
              </div>
            </div>
            <Switch
              checked={generateVideo}
              onCheckedChange={setGenerateVideo}
            />
          </div>

          {/* Generate Clips */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Scissors className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Generar clips destacados
                </p>
                <p className="text-xs text-gray-500">
                  Extrae los mejores momentos en clips cortos
                </p>
              </div>
            </div>
            <Switch
              checked={generateClips}
              onCheckedChange={setGenerateClips}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
