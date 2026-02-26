import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { listVoices } from "@/lib/elevenlabs"
import { getAllSpanishVoices } from "@/lib/spanish-voices"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      )
    }

    // Check if user wants only Spanish voices or all voices
    const url = new URL(request.url)
    const includeAll = url.searchParams.get("includeAll") === "true"

    // Always provide Spanish voices as primary option
    const spanishVoices = getAllSpanishVoices()

    if (includeAll) {
      // If user explicitly wants all voices, fetch from ElevenLabs and merge
      try {
        const allVoices = await listVoices()
        return NextResponse.json({
          voices: spanishVoices,
          allVoices,
          note: "Spanish voices are recommended for Spanish content",
        })
      } catch (e) {
        // If ElevenLabs fetch fails, return just Spanish voices
        console.warn("Could not fetch all ElevenLabs voices, returning Spanish voices only")
      }
    }

    // Default: return only Spanish voices for Spanish podcast generation
    return NextResponse.json({
      voices: spanishVoices,
      note: "Spanish voices optimized for Spanish podcast generation",
    })
  } catch (error) {
    console.error("Error listing voices:", error)
    return NextResponse.json(
      { message: "Error al obtener voces" },
      { status: 500 }
    )
  }
}
