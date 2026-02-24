import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDbUser } from "@/actions/user"
import { getSystemPresets, getUserPresets } from "@/actions/preset"
import { PresetsClient } from "./client"

export const metadata: Metadata = {
  title: "Presets | PodcastAI",
}

export default async function PresetsPage() {
  const user = await getDbUser()

  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const [systemPresets, userPresets] = await Promise.all([
    getSystemPresets(),
    getUserPresets(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presets</h1>
          <p className="mt-1 text-gray-500">
            Configuraciones predefinidas para crear podcasts rápidamente
          </p>
        </div>
      </div>

      <PresetsClient
        systemPresets={JSON.parse(JSON.stringify(systemPresets))}
        userPresets={JSON.parse(JSON.stringify(userPresets))}
      />
    </div>
  )
}
