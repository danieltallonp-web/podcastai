import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDbUser } from "@/actions/user"
import { getUserPodcasts } from "@/actions/podcast"
import { getUserPlaylists } from "@/actions/playlist"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LibraryClient } from "./client"

export const metadata: Metadata = {
  title: "Biblioteca | PodcastAI",
}

export default async function LibraryPage() {
  const user = await getDbUser()

  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const [allPodcasts, favoritePodcasts, playlists] = await Promise.all([
    getUserPodcasts({ limit: 50 }),
    getUserPodcasts({ onlyFavorites: true, limit: 50 }),
    getUserPlaylists(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca</h1>
        <p className="mt-1 text-gray-500">
          Todos tus podcasts en un solo lugar
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({allPodcasts.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favoritos ({favoritePodcasts.length})
          </TabsTrigger>
          <TabsTrigger value="playlists">
            Playlists ({playlists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <LibraryClient
            podcasts={JSON.parse(JSON.stringify(allPodcasts))}
            variant="all"
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <LibraryClient
            podcasts={JSON.parse(JSON.stringify(favoritePodcasts))}
            variant="favorites"
          />
        </TabsContent>

        <TabsContent value="playlists" className="mt-6">
          <LibraryClient
            playlists={JSON.parse(JSON.stringify(playlists))}
            variant="playlists"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
