"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function getAuthUserId() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) throw new Error("Usuario no encontrado")
  return user.id
}

// List user's podcasts
export async function getUserPodcasts(options?: {
  limit?: number
  onlyFavorites?: boolean
}) {
  const userId = await getAuthUserId()

  return prisma.podcast.findMany({
    where: {
      userId,
      ...(options?.onlyFavorites ? { isFavorite: true } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 20,
  })
}

// Get a single podcast
export async function getPodcast(id: string) {
  const userId = await getAuthUserId()

  const podcast = await prisma.podcast.findFirst({
    where: { id, userId },
  })

  if (!podcast) throw new Error("Podcast no encontrado")
  return podcast
}

// Toggle favorite
export async function toggleFavorite(podcastId: string) {
  const userId = await getAuthUserId()

  const podcast = await prisma.podcast.findFirst({
    where: { id: podcastId, userId },
    select: { isFavorite: true },
  })

  if (!podcast) throw new Error("Podcast no encontrado")

  await prisma.podcast.update({
    where: { id: podcastId },
    data: { isFavorite: !podcast.isFavorite },
  })

  revalidatePath("/library")
  revalidatePath("/dashboard")
}

// Delete a podcast
export async function deletePodcast(podcastId: string) {
  const userId = await getAuthUserId()

  await prisma.podcast.deleteMany({
    where: { id: podcastId, userId },
  })

  revalidatePath("/library")
  revalidatePath("/dashboard")
}

// Track listen
export async function trackListen(podcastId: string) {
  const userId = await getAuthUserId()

  await prisma.podcast.update({
    where: { id: podcastId },
    data: { listenCount: { increment: 1 } },
  })

  await prisma.listeningEvent.create({
    data: {
      userId,
      podcastId,
    },
  })
}

// Update listening event (when user finishes or pauses)
export async function updateListeningEvent(
  eventId: string,
  data: {
    durationListenedSeconds: number
    completed: boolean
  }
) {
  await prisma.listeningEvent.update({
    where: { id: eventId },
    data: {
      ...data,
      endedAt: new Date(),
    },
  })
}
