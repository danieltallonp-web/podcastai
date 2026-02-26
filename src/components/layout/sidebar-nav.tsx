"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  Library,
  Layers,
  Settings,
  Headphones,
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Crear podcast",
    href: "/create",
    icon: PlusCircle,
  },
  {
    label: "Biblioteca",
    href: "/library",
    icon: Library,
  },
  {
    label: "Presets",
    href: "/presets",
    icon: Layers,
  },
  {
    label: "Ajustes",
    href: "/settings",
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Headphones className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">PodcastAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-violet-600" : "text-gray-400"
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
