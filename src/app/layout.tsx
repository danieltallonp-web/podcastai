import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { esES } from "@clerk/localizations"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "PodcastAI — Podcasts generados por IA a demanda",
    template: "%s | PodcastAI",
  },
  description:
    "Genera podcasts personalizados con inteligencia artificial. Describe lo que quieres escuchar y la IA lo produce en minutos con voces realistas.",
  keywords: [
    "podcast",
    "inteligencia artificial",
    "AI",
    "text to speech",
    "generador de podcasts",
    "contenido de audio",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <Providers>
            {children}
          </Providers>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
