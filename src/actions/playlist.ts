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

export async function getUserPlaylists() {
  const userId = await getAuthUserId()
  return prisma.playlist.findMany({
    where: { userId },
    include: {
      items: {
        include: { podcast: true },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function createPlaylist(name: string, description?: string) {
  const userId = await getAuthUserId()
  const playlist = await prisma.playlist.create({
    data: { userId, name, description },
  })
  revalidatePath("/library")
  return playlist
}

export async function deletePlaylist(playlistId: string) {
  const userId = await getAuthUserId()
  await prisma.playlist.deleteMany({
    where: { id: playlistId, userId },
  })
  revalidatePath("/library")
}

export async function addToPlaylist(playlistId: string, podcastId: string) {
  const userId = await getAuthUserId()

  // Verify ownership
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
    include: { items: { orderBy: { position: "desc" }, take: 1 } },
  })
  if (!playlist) throw new Error("Playlist no encontrada")

  const maxPosition = playlist.items[0]?.position ?? 0

  await prisma.playlistItem.create({
    data: {
      playlistId,
      podcastId,
      position: maxPosition + 1,
    },
  })

  revalidatePath("/library")
}

export async function removeFromPlaylist(
  playlistId: string,
  podcastId: string
) {
  await prisma.playlistItem.deleteMany({
    where: { playlistId, podcastId },
  })
  revalidatePath("/library")
}
