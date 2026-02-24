import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDbUser } from "@/actions/user"
import { getUserPodcasts } from "@/actions/podcast"
import { QuickCreate } from "@/components/dashboard/quick-create"
import { RecentPodcasts } from "@/components/dashboard/recent-podcasts"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getDbUser()

  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const podcasts = await getUserPodcasts({ limit: 12 })

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hola{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-gray-500">
          ¿Qué quieres escuchar hoy?
        </p>
      </div>

      {/* Quick create */}
      <QuickCreate />

      {/* Recent podcasts */}
      <RecentPodcasts podcasts={podcasts} />
    </div>
  )
}
