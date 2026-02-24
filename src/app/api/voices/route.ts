import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { listVoices } from "@/lib/elevenlabs"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      )
    }

    const voices = await listVoices()

    return NextResponse.json({ voices })
  } catch (error) {
    console.error("Error listing voices:", error)
    return NextResponse.json(
      { message: "Error al obtener voces" },
      { status: 500 }
    )
  }
}
