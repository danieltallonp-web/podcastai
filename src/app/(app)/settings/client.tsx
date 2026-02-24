"use client"

import { useState, useTransition } from "react"
import { User, CreditCard, Settings2 } from "lucide-react"
import { toast } from "sonner"

import { updateProfile } from "@/actions/user"
import { createCheckoutSession, createPortalSession } from "@/actions/stripe"
import {
  INTEREST_TOPICS,
  PODCAST_FORMATS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
  PLAN_LIMITS,
  PRICING,
} from "@/lib/constants"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserProps {
  id: string
  name: string | null
  email: string
  plan: "FREE" | "PRO" | "PREMIUM"
  interests: string[]
  preferredFormats: string[]
  preferredTone: string | null
  preferredLanguage: string
  podcastsGeneratedThisMonth: number
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
}

export function SettingsClient({ user }: { user: UserProps }) {
  // Profile tab state
  const [name, setName] = useState(user.name ?? "")
  const [interests, setInterests] = useState<string[]>(user.interests)

  // Preferences tab state
  const [preferredFormats, setPreferredFormats] = useState<string[]>(
    user.preferredFormats
  )
  const [preferredTone, setPreferredTone] = useState(
    user.preferredTone ?? "casual"
  )
  const [preferredLanguage, setPreferredLanguage] = useState(
    user.preferredLanguage
  )

  const [isPending, startTransition] = useTransition()

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleFormat = (id: string) => {
    setPreferredFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const handleSaveProfile = () => {
    startTransition(async () => {
      try {
        await updateProfile({ name: name || undefined, interests })
        toast.success("Perfil actualizado correctamente")
      } catch {
        toast.error("Error al actualizar el perfil")
      }
    })
  }

  const handleSavePreferences = () => {
    startTransition(async () => {
      try {
        await updateProfile({
          preferredFormats,
          preferredTone,
          preferredLanguage,
        })
        toast.success("Preferencias actualizadas correctamente")
      } catch {
        toast.error("Error al actualizar las preferencias")
      }
    })
  }

  const handleManageSubscription = () => {
    startTransition(async () => {
      try {
        await createPortalSession()
      } catch {
        toast.error("Error al abrir el portal de suscripción")
      }
    })
  }

  const handleUpgrade = (plan: "PRO" | "PREMIUM") => {
    startTransition(async () => {
      try {
        await createCheckoutSession(plan)
      } catch {
        toast.error("Error al iniciar el proceso de pago")
      }
    })
  }

  const planLimit =
    PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].podcastsPerMonth
  const usagePercentage =
    planLimit === Infinity
      ? 0
      : Math.min((user.podcastsGeneratedThisMonth / planLimit) * 100, 100)

  const planColors = {
    FREE: "bg-gray-100 text-gray-700 border-gray-300",
    PRO: "bg-violet-100 text-violet-700 border-violet-300",
    PREMIUM: "bg-amber-100 text-amber-700 border-amber-300",
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile" className="gap-1.5">
          <User className="size-4" />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="plan" className="gap-1.5">
          <CreditCard className="size-4" />
          Plan
        </TabsTrigger>
        <TabsTrigger value="preferences" className="gap-1.5">
          <Settings2 className="size-4" />
          Preferencias
        </TabsTrigger>
      </TabsList>

      {/* ==================== TAB: PERFIL ==================== */}
      <TabsContent value="profile" className="space-y-6 pt-4">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="max-w-md"
          />
        </div>

        {/* Intereses */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Temas de interés
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TOPICS.map((topic) => {
              const isActive = interests.includes(topic.id)
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleInterest(topic.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-violet-300 bg-violet-100 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span>{topic.icon}</span>
                  {topic.label}
                </button>
              )
            })}
          </div>
        </div>

        <Button onClick={handleSaveProfile} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar perfil"}
        </Button>
      </TabsContent>

      {/* ==================== TAB: PLAN ==================== */}
      <TabsContent value="plan" className="space-y-6 pt-4">
        {/* Current plan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Tu plan actual
            </h3>
            <Badge
              variant="outline"
              className={planColors[user.plan]}
            >
              {user.plan}
            </Badge>
          </div>

          {/* Usage */}
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Podcasts este mes</span>
              <span className="font-medium text-gray-900">
                {user.podcastsGeneratedThisMonth}/
                {planLimit === Infinity ? "Ilimitados" : planLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          {/* Billing date */}
          {user.stripeCurrentPeriodEnd && (
            <p className="text-sm text-gray-500">
              Próxima facturación:{" "}
              {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString(
                "es-ES",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}

          {/* Manage subscription */}
          {user.stripeSubscriptionId && (
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isPending}
            >
              Gestionar suscripción
            </Button>
          )}
        </div>

        {/* Upgrade cards (only for FREE users) */}
        {user.plan === "FREE" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Mejora tu plan
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRICING.filter((p) => p.plan !== "FREE").map((plan) => (
                <div
                  key={plan.plan}
                  className={`relative rounded-xl border p-6 ${
                    "popular" in plan && plan.popular
                      ? "border-violet-300 bg-violet-50/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {"popular" in plan && plan.popular && (
                    <Badge className="absolute -top-2.5 right-4 bg-violet-600 text-white">
                      Popular
                    </Badge>
                  )}
                  <h4 className="text-lg font-bold text-gray-900">
                    {plan.name}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.description}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      /mes
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.slice(0, 5).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-violet-500">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={"popular" in plan && plan.popular ? "default" : "outline"}
                    onClick={() =>
                      handleUpgrade(plan.plan as "PRO" | "PREMIUM")
                    }
                    disabled={isPending}
                  >
                    Actualizar a {plan.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {/* ==================== TAB: PREFERENCIAS ==================== */}
      <TabsContent value="preferences" className="space-y-6 pt-4">
        {/* Default format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Formatos preferidos
          </label>
          <div className="flex flex-wrap gap-2">
            {PODCAST_FORMATS.map((format) => {
              const isActive = preferredFormats.includes(format.id)
              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => toggleFormat(format.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-violet-300 bg-violet-100 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span>{format.icon}</span>
                  {format.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Default tone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tono preferido
          </label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((tone) => {
              const isActive = preferredTone === tone.id
              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setPreferredTone(tone.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-violet-300 bg-violet-100 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span>{tone.icon}</span>
                  {tone.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Default language */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Idioma predeterminado
          </label>
          <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSavePreferences} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar preferencias"}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
