import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"
import type { PodcastScript } from "@/types"

/**
 * Generates a plain text transcript from the podcast script.
 */
function generateTranscript(script: PodcastScript): string {
  const lines: string[] = []

  lines.push(`${script.title}`)
  lines.push(`${"=".repeat(script.title.length)}`)
  lines.push("")

  if (script.description) {
    lines.push(script.description)
    lines.push("")
  }

  lines.push("---")
  lines.push("")

  for (const segment of script.segments) {
    for (const block of segment.blocks) {
      if (!block.text.trim()) continue

      const speaker = block.voiceName || "Speaker"
      lines.push(`[${speaker}]`)
      lines.push(block.text)
      lines.push("")
    }
  }

  return lines.join("\n")
}

/**
 * Post-processes a generated podcast:
 * - Generates a text transcript from the script
 * - Uploads the transcript to Supabase Storage
 * - Updates the podcast record with the transcript URL
 */
export async function postProcess(
  podcastId: string,
  script: PodcastScript
): Promise<void> {
  const transcript = generateTranscript(script)

  // Upload transcript to Supabase Storage
  const supabase = createServerClient()
  const storagePath = `${podcastId}/transcript.txt`

  const { error: uploadError } = await supabase.storage
    .from("podcasts")
    .upload(storagePath, Buffer.from(transcript, "utf-8"), {
      contentType: "text/plain; charset=utf-8",
      upsert: true,
    })

  if (uploadError) {
    console.error("[post-process] Transcript upload failed:", uploadError)
    throw new Error(`Failed to upload transcript: ${uploadError.message}`)
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("podcasts")
    .getPublicUrl(storagePath)

  const transcriptUrl = urlData.publicUrl

  // Update the podcast record with the transcript URL
  await prisma.podcast.update({
    where: { id: podcastId },
    data: { transcriptUrl },
  })
}
