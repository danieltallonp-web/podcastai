"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { updateOnboarding } from "@/actions/user"
import {
  INTEREST_TOPICS,
  PODCAST_FORMATS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/constants"
import {
  ArrowRight,
  ArrowLeft,
  Headphones,
  Check,
  Sparkles,
} from "lucide-react"

const steps = [
  { title: "Tus intereses", subtitle: "¿Qué temas te interesan?" },
  { title: "Tu formato", subtitle: "¿Cómo prefieres escuchar?" },
  { title: "Tu estilo", subtitle: "Personaliza la experiencia" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [selectedTone, setSelectedTone] = useState("casual")
  const [selectedLanguage, setSelectedLanguage] = useState("es")

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    )
  }

  const canContinue = () => {
    if (step === 0) return selectedInterests.length >= 3
    if (step === 1) return selectedFormats.length >= 1
    return true
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateOnboarding({
        interests: selectedInterests,
        preferredFormats: selectedFormats,
        preferredTone: selectedTone,
        preferredLanguage: selectedLanguage,
      })
      toast.success("¡Bienvenido a PodcastAI!")
      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar preferencias"
      console.error("[onboarding] Error saving preferences:", error)
      toast.error(errorMessage || "Error al guardar preferencias")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
          <Headphones className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {steps[step].title}
        </h1>
        <p className="mt-1 text-gray-500">{steps[step].subtitle}</p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex justify-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-16 rounded-full transition-colors",
              i <= step ? "bg-violet-600" : "bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* Step 1: Interests */}
      {step === 0 && (
        <div>
          <p className="mb-4 text-center text-sm text-gray-500">
            Selecciona al menos 3 temas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {INTEREST_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => toggleInterest(topic.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  selectedInterests.includes(topic.id)
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                <span>{topic.icon}</span>
                {topic.label}
                {selectedInterests.includes(topic.id) && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Formats */}
      {step === 1 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {PODCAST_FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() => toggleFormat(format.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                selectedFormats.includes(format.id)
                  ? "border-violet-300 bg-violet-50 ring-1 ring-violet-300"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <span className="text-2xl">{format.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{format.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {format.description}
                </p>
              </div>
              {selectedFormats.includes(format.id) && (
                <Check className="ml-auto h-5 w-5 shrink-0 text-violet-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Tone + Language */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Tono preferido
            </h3>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    selectedTone === tone.id
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  )}
                >
                  <span>{tone.icon}</span>
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Idioma principal
            </h3>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    selectedLanguage === lang.id
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  )}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>

        {step < 2 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue()}
            className="gap-2"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              "Guardando..."
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Empezar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
