import { generateSpeech } from "@/lib/elevenlabs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { voiceId, text } = await request.json()

    // Validate input
    if (!voiceId || !text) {
      return NextResponse.json(
        { error: "Missing voiceId or text" },
        { status: 400 }
      )
    }

    // Generate speech
    const audioBuffer = await generateSpeech({
      text,
      voiceId,
      speed: 1.0,
    })

    // Return audio as response with proper content type
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=preview.mp3",
      },
    })
  } catch (error) {
    console.error("[tts-preview] Error generating speech:", error)
    return NextResponse.json(
      { error: "Failed to generate speech preview" },
      { status: 500 }
    )
  }
}
