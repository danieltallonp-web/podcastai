import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"
import type { PodcastConfig } from "@/types"
import type { PodcastStatus } from "@prisma/client"
import { research } from "./research"
import { generateScript } from "./script"
import { synthesizeAudio } from "./voice"
import { produceAudio } from "./production"
import { postProcess } from "./post-process"

/**
 * Updates the podcast status in the database and broadcasts progress
 * via Supabase Realtime.
 */
async function updateProgress(
  podcastId: string,
  status: PodcastStatus,
  step: string,
  message: string
): Promise<void> {
  // Update database status
  await prisma.podcast.update({
    where: { id: podcastId },
    data: { status },
  })

  // Broadcast progress via Supabase Realtime
  try {
    const supabase = createServerClient()
    const channel = supabase.channel(`podcast:${podcastId}`)
    await channel.send({
      type: "broadcast",
      event: "progress",
      payload: { status, step, message },
    })
  } catch (broadcastError) {
    // Don't fail the pipeline if broadcast fails
    console.error("[orchestrator] Realtime broadcast failed:", broadcastError)
  }
}

/**
 * Main pipeline entry point. Orchestrates the entire podcast generation process:
 * 1. Research the topic
 * 2. Generate the script
 * 3. Synthesize audio
 * 4. Produce final audio + post-process
 * 5. Mark as ready
 *
 * On failure, marks the podcast as FAILED with error details.
 */
export async function runPipeline(
  podcastId: string,
  config: PodcastConfig
): Promise<void> {
  try {
    // ── Step 1: Research ──────────────────────────────────────────────
    await updateProgress(podcastId, "RESEARCHING", "research", "Searching for relevant information...")

    const researchContext = await research(config)

    // ── Step 2: Script Generation ─────────────────────────────────────
    await updateProgress(podcastId, "SCRIPTING", "script", "Writing the podcast script...")

    const script = await generateScript(config, researchContext)

    // Save script to the podcast record
    await prisma.podcast.update({
      where: { id: podcastId },
      data: {
        script: script as any,
        title: script.title,
        description: script.description,
      },
    })

    // ── Step 3: Audio Synthesis ───────────────────────────────────────
    await updateProgress(podcastId, "GENERATING_AUDIO", "voice", "Generating voice audio...")

    const audioBuffers = await synthesizeAudio(script, config)

    // ── Step 4: Production & Post-Processing ─────────────────────────
    await updateProgress(podcastId, "POST_PRODUCING", "production", "Assembling final podcast...")

    const [productionResult] = await Promise.all([
      produceAudio(audioBuffers, podcastId),
      postProcess(podcastId, script),
    ])

    // ── Step 5: Mark as Ready ────────────────────────────────────────
    await prisma.podcast.update({
      where: { id: podcastId },
      data: {
        status: "READY",
        audioUrl: productionResult.audioUrl,
        durationSeconds: productionResult.durationSeconds,
      },
    })

    await updateProgress(podcastId, "READY", "complete", "Podcast is ready!")
  } catch (error) {
    console.error(`[orchestrator] Pipeline failed for podcast ${podcastId}:`, error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    // Mark podcast as failed with error details in generationLog
    try {
      await prisma.podcast.update({
        where: { id: podcastId },
        data: {
          status: "FAILED",
          generationLog: {
            error: errorMessage,
            failedAt: new Date().toISOString(),
          },
        },
      })

      await updateProgress(podcastId, "FAILED", "error", errorMessage)
    } catch (updateError) {
      console.error("[orchestrator] Failed to update podcast status to FAILED:", updateError)
    }
  }
}
