"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PlayerBar } from "@/components/layout/player-bar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile navigation */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main content area */}
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />

        <main className="p-4 pb-40 sm:p-6 sm:pb-40 lg:p-8 lg:pb-40">{children}</main>
      </div>

      {/* Persistent audio player */}
      <PlayerBar />
    </div>
  )
}
