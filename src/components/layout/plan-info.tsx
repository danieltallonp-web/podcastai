"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getDbUser } from "@/actions/user"
import type { Plan } from "@prisma/client"

const planLabels: Record<Plan, string> = {
  FREE: "Plan Free",
  PRO: "Plan Pro",
  PREMIUM: "Plan Premium",
}

const planColors: Record<Plan, string> = {
  FREE: "from-violet-50 to-indigo-50",
  PRO: "from-blue-50 to-cyan-50",
  PREMIUM: "from-amber-50 to-orange-50",
}

const planTextColors: Record<Plan, string> = {
  FREE: "text-violet-800",
  PRO: "text-blue-800",
  PREMIUM: "text-amber-800",
}

const planSubTextColors: Record<Plan, string> = {
  FREE: "text-violet-600",
  PRO: "text-blue-600",
  PREMIUM: "text-amber-600",
}

export function PlanInfo() {
  const [user, setUser] = useState<{
    plan: Plan
    podcastsGeneratedThisMonth: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDbUser().then((userData) => {
      setUser(userData)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 p-3">
          <div className="h-4 w-16 animate-pulse rounded bg-violet-200" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-violet-100" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 p-3">
          <p className="text-xs font-medium text-violet-800">Plan Free</p>
          <p className="mt-1 text-xs text-violet-600">0/3 podcasts este mes</p>
          <Link
            href="/settings"
            className="mt-2 block text-xs font-semibold text-violet-700 hover:underline"
          >
            Actualizar plan →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-100 p-4">
      <div
        className={cn(
          "rounded-lg bg-gradient-to-br p-3",
          planColors[user.plan]
        )}
      >
        <p className={cn("text-xs font-medium", planTextColors[user.plan])}>
          {planLabels[user.plan]}
        </p>
        <p className={cn("mt-1 text-xs", planSubTextColors[user.plan])}>
          {user.podcastsGeneratedThisMonth}/
          {user.plan === "FREE" ? "3" : user.plan === "PRO" ? "25" : "∞"}{" "}
          podcasts este mes
        </p>
        <Link
          href="/settings"
          className={cn(
            "mt-2 block text-xs font-semibold hover:underline",
            planSubTextColors[user.plan]
          )}
        >
          Actualizar plan →
        </Link>
      </div>
    </div>
  )
}
