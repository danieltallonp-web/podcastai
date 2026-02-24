"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { anthropic } from "@/lib/anthropic"
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

// Get pending recommendations for the current user
export async function getRecommendations() {
  const userId = await getAuthUserId()

  return prisma.recommendation.findMany({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
}

// Dismiss a recommendation
export async function dismissRecommendation(id: string) {
  const userId = await getAuthUserId()

  // Verify the recommendation belongs to the user
  const recommendation = await prisma.recommendation.findFirst({
    where: { id, userId },
  })

  if (!recommendation) throw new Error("Recomendación no encontrada")

  await prisma.recommendation.update({
    where: { id },
    data: { status: "DISMISSED" },
  })

  revalidatePath("/dashboard")
}

// Generate new AI-powered recommendations
export async function generateRecommendations() {
  const userId = await getAuthUserId()

  // Get user preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      interests: true,
      preferredFormats: true,
    },
  })

  if (!user) throw new Error("Usuario no encontrado")

  // Get recent podcasts for context
  const recentPodcasts = await prisma.podcast.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { title: true, format: true, prompt: true },
  })

  // Dismiss all existing PENDING recommendations for this user
  await prisma.recommendation.updateMany({
    where: { userId, status: "PENDING" },
    data: { status: "DISMISSED" },
  })

  // Generate recommendations with Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Eres un asistente que sugiere temas para podcasts.

Intereses del usuario: ${user.interests.join(", ")}
Formatos preferidos: ${user.preferredFormats.join(", ")}

Podcasts recientes del usuario:
${recentPodcasts.map((p) => `- "${p.title}" (${p.format}): ${p.prompt}`).join("\n")}

Genera exactamente 3 recomendaciones de podcasts DIFERENTES a lo que ya ha escuchado.
Responde SOLO con un JSON array con este formato:
[{"title": "...", "description": "...", "config": {"format": "CONVERSATION|MONOLOGUE|DEBATE|NARRATION|CLASS|ROUNDTABLE", "duration": 15, "tone": ["casual"], "language": "es"}, "reason": "..."}]`,
      },
    ],
  })

  // Extract text content from the response
  const textBlock = response.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response")
  }

  const rawText = textBlock.text.trim()

  // Parse JSON — Claude sometimes wraps JSON in markdown code blocks
  let jsonString = rawText
  const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonString = jsonMatch[1].trim()
  }

  let recommendations: Array<{
    title: string
    description: string
    config: Record<string, unknown>
    reason: string
  }>

  try {
    recommendations = JSON.parse(jsonString)
  } catch {
    console.error(
      "[recommendations] Failed to parse Claude response as JSON:",
      rawText.slice(0, 500)
    )
    throw new Error("Failed to parse recommendations from Claude response")
  }

  // Validate basic structure
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    throw new Error("Invalid recommendations structure")
  }

  // Create recommendations in DB
  await prisma.recommendation.createMany({
    data: recommendations.map((r) => ({
      userId,
      title: r.title,
      description: r.description,
      suggestedConfig: JSON.parse(JSON.stringify(r.config)),
      reason: r.reason,
    })),
  })

  revalidatePath("/dashboard")
}
