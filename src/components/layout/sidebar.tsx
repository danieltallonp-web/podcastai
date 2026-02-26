"use client"

import { SidebarNav } from "./sidebar-nav"
import { PlanInfo } from "./plan-info"

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex">
      <SidebarNav />
      <PlanInfo />
    </aside>
  )
}
