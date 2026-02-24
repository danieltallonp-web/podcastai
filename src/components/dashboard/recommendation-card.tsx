"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

interface RecommendationCardProps {
  id: string
  title: string
  description?: string | null
  reason?: string | null
  onGenerate: (id: string) => void
  onDismiss: (id: string) => void
}

export function RecommendationCard({
  id,
  title,
  description,
  reason,
  onGenerate,
  onDismiss,
}: RecommendationCardProps) {
  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm">
      <button
        onClick={() => onDismiss(id)}
        className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="mb-3 inline-flex rounded-lg bg-amber-50 p-2 text-amber-600">
        <Sparkles className="h-4 w-4" />
      </div>

      <h3 className="mb-1 text-sm font-semibold text-gray-900">{title}</h3>

      {description && (
        <p className="mb-2 text-xs text-gray-500">{description}</p>
      )}

      {reason && (
        <p className="mb-3 text-xs italic text-gray-400">{reason}</p>
      )}

      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs"
        onClick={() => onGenerate(id)}
      >
        Generar este podcast
      </Button>
    </div>
  )
}
