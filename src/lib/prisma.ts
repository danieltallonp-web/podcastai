import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    // Improve connection pooling
    errorFormat: "pretty",
  })

// Ensure singleton in development to prevent connection pool issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit(0)
})
