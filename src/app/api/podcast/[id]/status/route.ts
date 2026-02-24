import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    const podcast = await prisma.podcast.findFirst({
      where: { id, userId: user.id },
      select: {
        status: true,
        audioUrl: true,
        durationSeconds: true,
        title: true,
      },
    })

    if (!podcast) {
      return NextResponse.json(
        { message: "Podcast no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(podcast)
  } catch (error) {
    console.error("Error getting podcast status:", error)
    return NextResponse.json(
      { message: "Error interno" },
      { status: 500 }
    )
  }
}
