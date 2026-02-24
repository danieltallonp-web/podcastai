"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Sync current Clerk user to our database (called on first login or profile change)
export async function syncUser() {
  const user = await currentUser()
  if (!user) return null

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      imageUrl: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      imageUrl: user.imageUrl,
    },
  })

  return dbUser
}

// Get current user from database
export async function getDbUser() {
  const { userId } = await auth()
  if (!userId) return null

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // If user doesn't exist in DB yet, sync them
  if (!dbUser) {
    dbUser = await syncUser()
  }

  return dbUser
}

// Update onboarding preferences
export async function updateOnboarding(data: {
  interests: string[]
  preferredFormats: string[]
  preferredTone: string
  preferredLanguage: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("No autenticado")

  const dbUser = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      interests: data.interests,
      preferredFormats: data.preferredFormats,
      preferredTone: data.preferredTone,
      preferredLanguage: data.preferredLanguage,
      onboardingCompleted: true,
    },
  })

  revalidatePath("/dashboard")
  return dbUser
}

// Update user profile
export async function updateProfile(data: {
  name?: string
  preferredLanguage?: string
  preferredTone?: string
  interests?: string[]
  preferredFormats?: string[]
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("No autenticado")

  const dbUser = await prisma.user.update({
    where: { clerkId: userId },
    data,
  })

  revalidatePath("/settings")
  return dbUser
}

// Check if user has completed onboarding
export async function checkOnboarding(): Promise<{
  completed: boolean
  redirectTo?: string
}> {
  const dbUser = await getDbUser()
  if (!dbUser) {
    return { completed: false, redirectTo: "/sign-in" }
  }

  if (!dbUser.onboardingCompleted) {
    return { completed: false, redirectTo: "/onboarding" }
  }

  return { completed: true }
}
