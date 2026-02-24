"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { SYSTEM_PRESETS } from "@/lib/constants"

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

// List all system presets
export async function getSystemPresets() {
  return prisma.preset.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  })
}

// List user's custom presets
export async function getUserPresets() {
  const userId = await getAuthUserId()

  return prisma.preset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

// Get a single preset (must belong to user or be a system preset)
export async function getPreset(id: string) {
  const userId = await getAuthUserId()

  const preset = await prisma.preset.findFirst({
    where: {
      id,
      OR: [{ userId }, { isSystem: true }],
    },
  })

  if (!preset) throw new Error("Preset no encontrado")
  return preset
}

// Create a custom preset
export async function createPreset(data: {
  name: string
  description?: string
  icon?: string
  config: Record<string, unknown>
}) {
  const userId = await getAuthUserId()

  const preset = await prisma.preset.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      icon: data.icon ?? null,
      config: JSON.parse(JSON.stringify(data.config)),
      isSystem: false,
      userId,
    },
  })

  revalidatePath("/presets")
  return preset
}

// Update a user-owned preset (cannot update system presets)
export async function updatePreset(
  id: string,
  data: {
    name?: string
    description?: string
    icon?: string
    config?: Record<string, unknown>
  }
) {
  const userId = await getAuthUserId()

  const preset = await prisma.preset.findFirst({
    where: { id, userId, isSystem: false },
  })

  if (!preset) throw new Error("Preset no encontrado o no tienes permiso para editarlo")

  const updated = await prisma.preset.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.config !== undefined && { config: JSON.parse(JSON.stringify(data.config)) }),
    },
  })

  revalidatePath("/presets")
  return updated
}

// Delete a user-owned preset (cannot delete system presets)
export async function deletePreset(id: string) {
  const userId = await getAuthUserId()

  const preset = await prisma.preset.findFirst({
    where: { id, userId, isSystem: false },
  })

  if (!preset) throw new Error("Preset no encontrado o no tienes permiso para eliminarlo")

  await prisma.preset.delete({
    where: { id },
  })

  revalidatePath("/presets")
}

// Seed system presets (admin utility)
export async function seedSystemPresets() {
  // Delete all existing system presets
  await prisma.preset.deleteMany({
    where: { isSystem: true },
  })

  // Create all system presets from constants
  await prisma.preset.createMany({
    data: SYSTEM_PRESETS.map((preset) => ({
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
      config: JSON.parse(JSON.stringify(preset.config)),
      isSystem: true,
      userId: null,
    })),
  })

  revalidatePath("/presets")
}
