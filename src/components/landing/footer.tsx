import Link from "next/link"
import { Headphones } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Headphones className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">PodcastAI</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
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

          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PodcastAI. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
