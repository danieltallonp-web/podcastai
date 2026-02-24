import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { PodcastConfig } from "@/types"
import type { PodcastFormat } from "@prisma/client"
import { PLAN_LIMITS } from "@/lib/constants"

export async function POST(req: Request) {
  try {
    // Auth check
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      )
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Parse config
    const config: PodcastConfig = await req.json()

    if (!config.prompt?.trim()) {
      return NextResponse.json(
        { message: "El prompt es obligatorio" },
        { status: 400 }
      )
    }

    // Check plan limits
    const limits = PLAN_LIMITS[user.plan]
    if (user.podcastsGeneratedThisMonth >= limits.podcastsPerMonth) {
      return NextResponse.json(
        {
          message: `Has alcanzado el límite de ${limits.podcastsPerMonth} podcasts este mes. Actualiza tu plan para generar más.`,
        },
        { status: 403 }
      )
    }

    // Validate duration against plan
    if (config.duration > limits.maxDuration) {
      return NextResponse.json(
        {
          message: `La duración máxima para tu plan es ${limits.maxDuration} minutos.`,
        },
        { status: 403 }
      )
    }

    // Map format string to enum
    const formatMap: Record<string, PodcastFormat> = {
      monologue: "MONOLOGUE",
      conversation: "CONVERSATION",
      debate: "DEBATE",
      narration: "NARRATION",
      class: "CLASS",
      roundtable: "ROUNDTABLE",
      interview: "INTERVIEW",
      interactive: "INTERACTIVE",
    }

    const format = formatMap[config.format] ?? "CONVERSATION"

    // Create podcast record
    const podcast = await prisma.podcast.create({
      data: {
        userId: user.id,
        title: config.prompt.slice(0, 100),
        prompt: config.prompt,
        config: JSON.parse(JSON.stringify(config)),
        format,
        language: config.language ?? "es",
        status: "QUEUED",
      },
    })

    // Increment monthly counter
    await prisma.user.update({
      where: { id: user.id },
      data: { podcastsGeneratedThisMonth: { increment: 1 } },
    })

    // Fire-and-forget: launch pipeline asynchronously
    // Dynamic import to avoid loading pipeline code on every request
    import("@/pipeline/orchestrator").then(({ runPipeline }) => {
      runPipeline(podcast.id, config).catch((err) => {
        console.error(`Pipeline failed for podcast ${podcast.id}:`, err)
      })
    })

    return NextResponse.json({
      podcastId: podcast.id,
      message: "Generación iniciada",
    })
  } catch (error) {
    console.error("Error in /api/generate:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
