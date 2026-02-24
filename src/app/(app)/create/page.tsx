"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCreateStore } from "@/stores/create-store"
import { SimpleForm } from "@/components/create/simple-form"
import { AdvancedForm } from "@/components/create/advanced-form"
import { Settings2, Zap } from "lucide-react"

export default function CreatePage() {
  const { mode, setMode } = useCreateStore()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear podcast</h1>
        <p className="mt-1 text-gray-500">
          Configura y genera tu podcast personalizado
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-xl border border-gray-200 bg-white p-1">
        <button
          onClick={() => setMode("simple")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            mode === "simple"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Zap className="h-4 w-4" />
          Simple
        </button>
        <button
          onClick={() => setMode("advanced")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            mode === "advanced"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Settings2 className="h-4 w-4" />
          Avanzado
        </button>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {mode === "simple" ? <SimpleForm /> : <AdvancedForm />}
      </div>
    </div>
  )
}
