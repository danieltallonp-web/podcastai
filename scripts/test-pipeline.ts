// Load environment variables FIRST before importing any modules
import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { prisma } from "@/lib/prisma"
import type { PodcastConfig } from "@/types"
import { runPipeline } from "@/pipeline/orchestrator"

async function testPipeline() {
  console.log("🚀 Starting end-to-end pipeline test...\n")

  const startTime = Date.now()

  try {
    // Create or get a test user
    let user = await prisma.user.findFirst({
      where: { email: "test@podcastai.local" },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: "test-user-" + Date.now(),
          email: "test@podcastai.local",
          name: "Test User",
          plan: "FREE",
        },
      })
      console.log("✅ Created test user:", user.email)
    } else {
      console.log("✅ Using existing test user:", user.email)
    }

    // Configure podcast generation
    const config: PodcastConfig = {
      prompt:
        "Un debate fascinante de 2 minutos sobre si la inteligencia artificial reemplazará a los programadores",
      format: "debate",
      language: "es",
      duration: 2,
      voices: [
        {
          name: "Rachel",
          voiceId: "21m00Tcm4TlvDq8ikWAM",
          speed: 1.0,
        },
        {
          name: "Ethan",
          voiceId: "JBFqnCBsd6RMkjVY3PnL",
          speed: 1.0,
        },
      ],
    }

    // Create a podcast record
    const podcast = await prisma.podcast.create({
      data: {
        userId: user.id,
        title: "Test Podcast",
        prompt: config.prompt,
        format: "DEBATE",
        language: "es",
        status: "QUEUED",
        config: JSON.parse(JSON.stringify(config)),
      },
    })

    console.log("✅ Created test podcast:", podcast.id)
    console.log("")

    console.log("📋 Pipeline Configuration:")
    console.log("   - Format:", config.format)
    console.log("   - Duration:", config.duration, "minutes")
    console.log("   - Language:", config.language)
    console.log("")

    // Run the pipeline
    console.log("🔄 Running pipeline stages...\n")

    await runPipeline(podcast.id, config)

    // Fetch the completed podcast
    const completed = await prisma.podcast.findUnique({
      where: { id: podcast.id },
    })

    const duration = (Date.now() - startTime) / 1000
    console.log("\n✅ Pipeline test completed successfully!")
    console.log("")
    console.log("📊 Results:")
    console.log("   - Status:", completed?.status)
    console.log("   - Title:", completed?.title)
    if (completed?.audioUrl) {
      console.log("   - Audio URL:", completed.audioUrl)
    }
    if (completed?.durationSeconds) {
      console.log("   - Audio duration:", completed.durationSeconds, "seconds")
    }
    console.log("   - Total time:", duration.toFixed(1), "seconds")
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000
    console.error("❌ Pipeline test failed:")
    console.error(error)
    console.error("   - Duration:", duration.toFixed(1), "seconds")
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testPipeline()
