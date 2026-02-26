import { createServerClient } from "@/lib/supabase/server"

// Approximate MP3 bytes per second at 128kbps
const MP3_BYTES_PER_SECOND = 16000

/**
 * Concatenates audio buffers, uploads the final file to Supabase Storage,
 * and returns the public URL with estimated duration.
 */
export async function produceAudio(
  audioBuffers: Buffer[],
  podcastId: string
): Promise<{ audioUrl: string; durationSeconds: number }> {
  if (audioBuffers.length === 0) {
    throw new Error("No audio buffers to produce")
  }

  // Concatenate all audio buffers into a single buffer
  const finalBuffer = Buffer.concat(audioBuffers)

  if (finalBuffer.length === 0) {
    throw new Error("Combined audio buffer is empty")
  }

  // Estimate duration from buffer size (MP3 at ~128kbps = ~16KB per second)
  const durationSeconds = Math.round(finalBuffer.length / MP3_BYTES_PER_SECOND)

  // Upload to Supabase Storage
  const supabase = createServerClient()
  const storagePath = `${podcastId}/audio.mp3`

  const { error: uploadError } = await supabase.storage
    .from("podcasts")
    .upload(storagePath, finalBuffer, {
      contentType: "audio/mpeg",
      upsert: true,
    })

  if (uploadError) {
    console.error("[production] Supabase upload failed:", uploadError)
    throw new Error(`Failed to upload audio: ${uploadError.message}`)
  }

  // Get the public URL for the uploaded file
  // Public URLs work better for audio streaming with range requests for seeking
  const { data: urlData } = supabase.storage
    .from("podcasts")
    .getPublicUrl(storagePath)

  const audioUrl = urlData.publicUrl

  if (!audioUrl) {
    throw new Error("Failed to get signed URL for uploaded audio")
  }

  return {
    audioUrl,
    durationSeconds,
  }
}
