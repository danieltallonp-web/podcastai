import Link from "next/link"
import { Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Footer } from "@/components/landing/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Headphones className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">PodcastAI</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-gray-900"
            >
              Características
            </Link>
            <Link
              href="#como-funciona"
              className="transition-colors hover:text-gray-900"
            >
              Cómo funciona
            </Link>
            <Link
              href="#precios"
              className="transition-colors hover:text-gray-900"
            >
              Precios
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <SignedOut>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Empezar gratis</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild size="sm">
                <Link href="/dashboard">Ir a la app</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <Footer />
    </div>
  )
}
