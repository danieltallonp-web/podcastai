"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useGenerationProgress } from "@/hooks/use-generation-progress"
import {
  Search,
  FileText,
  Mic2,
  Music,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
} from "lucide-react"

const STEPS = [
  {
    status: "RESEARCHING",
    icon: Search,
    label: "Investigando",
    description: "Buscando información relevante...",
  },
  {
    status: "SCRIPTING",
    icon: FileText,
    label: "Escribiendo guion",
    description: "Generando el guion con IA...",
  },
  {
    status: "GENERATING_AUDIO",
    icon: Mic2,
    label: "Generando audio",
    description: "Sintetizando voces realistas...",
  },
  {
    status: "POST_PRODUCING",
    icon: Music,
    label: "Produciendo",
    description: "Ensamblando el audio final...",
  },
  {
    status: "READY",
    icon: CheckCircle2,
    label: "¡Listo!",
    description: "Tu podcast está listo para escuchar",
  },
]

interface GenerationProgressProps {
  podcastId: string
}

export function GenerationProgress({ podcastId }: GenerationProgressProps) {
  const router = useRouter()
  const { progress, isComplete, isFailed } = useGenerationProgress(podcastId)

  const currentStepIndex = STEPS.findIndex(
    (s) => s.status === progress.status
  )

  return (
    <div className="mx-auto max-w-lg space-y-8 py-12 text-center">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {isFailed
            ? "Error en la generación"
            : isComplete
              ? "¡Podcast generado!"
              : "Generando tu podcast..."}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{progress.message}</p>
      </div>

      {/* Progress bar */}
      <Progress value={progress.percentage} className="h-2" />

      {/* Steps */}
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isActive = step.status === progress.status
          const isDone = index < currentStepIndex || isComplete
          const isPending = index > currentStepIndex && !isComplete

          return (
            <div
              key={step.status}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 transition-all",
                isActive && !isFailed
                  ? "border-violet-200 bg-violet-50"
                  : isDone
                    ? "border-green-100 bg-green-50/50"
                    : "border-gray-100 bg-gray-50/50 opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isDone
                    ? "bg-green-100 text-green-600"
                    : isActive && !isFailed
                      ? "bg-violet-100 text-violet-600"
                      : "bg-gray-100 text-gray-400"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isActive && !isFailed ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>

              <div className="text-left">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone
                      ? "text-green-700"
                      : isActive
                        ? "text-violet-700"
                        : "text-gray-500"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Error state */}
      {isFailed && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
          <p className="text-sm font-medium text-red-700">
            Hubo un error generando tu podcast
          </p>
          <p className="mt-1 text-xs text-red-500">
            Puedes intentar generarlo de nuevo
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => router.push("/create")}
          >
            Volver a intentar
          </Button>
        </div>
      )}

      {/* Success state */}
      {isComplete && (
        <Button
          size="lg"
          className="gap-2"
          onClick={() => router.push(`/podcast/${podcastId}`)}
        >
          <Play className="h-5 w-5" />
          Escuchar podcast
        </Button>
      )}
    </div>
  )
}
