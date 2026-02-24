import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDbUser } from "@/actions/user"
import { SettingsClient } from "./client"

export const metadata: Metadata = {
  title: "Ajustes | PodcastAI",
}

export default async function SettingsPage() {
  const user = await getDbUser()
  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
        <p className="mt-1 text-gray-500">Gestiona tu perfil y preferencias</p>
      </div>
      <SettingsClient user={JSON.parse(JSON.stringify(user))} />
    </div>
  )
}
