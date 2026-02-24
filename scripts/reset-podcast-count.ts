import { prisma } from "@/lib/prisma"

async function resetPodcastCount() {
  try {
    // Find the first user (there should be only one in development)
    const user = await prisma.user.findFirst({
      include: {
        podcasts: true,
      },
    })

    if (!user) {
      console.log("❌ No users found in database")
      return
    }

    console.log(`\n📊 User: ${user.name} (${user.email})`)
    console.log(`📈 Current podcast count: ${user.podcastsGeneratedThisMonth}`)
    console.log(`🎙️  Total podcasts in DB: ${user.podcasts.length}`)
    console.log("")

    // Reset the counter
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { podcastsGeneratedThisMonth: 0 },
    })

    console.log("✅ Podcast counter reset to 0")
    console.log(`\n🎯 Plan: ${updated.plan}`)
    console.log(`📊 Limit: 3 podcasts per month (FREE plan)`)
    console.log(`✨ You can now generate 3 more podcasts this month!\n`)
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPodcastCount()
