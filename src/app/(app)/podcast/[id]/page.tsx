import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { PodcastDetailClient } from "./client"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const podcast = await prisma.podcast.findUnique({
    where: { id },
    select: { title: true, description: true },
  })

  return {
    title: podcast?.title ?? "Podcast",
    description: podcast?.description ?? undefined,
  }
}

export default async function PodcastDetailPage({ params }: Props) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) redirect("/sign-in")

  const { id } = await params

  const podcast = await prisma.podcast.findFirst({
    where: { id, userId: user.id },
  })

  if (!podcast) notFound()

  return <PodcastDetailClient podcast={JSON.parse(JSON.stringify(podcast))} />
}
