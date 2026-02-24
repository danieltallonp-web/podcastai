"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export function QuickCreate() {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Crea tu siguiente podcast
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Describe lo que quieres escuchar y la IA lo produce en minutos.
          </p>
        </div>
        <Button
          onClick={() => router.push("/create")}
          className="gap-2 whitespace-nowrap"
        >
          Crear podcast
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
