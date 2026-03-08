"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Headphones, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@clerk/nextjs"

export function Hero() {
  const { isSignedIn } = useAuth()
  const ctaHref = isSignedIn ? "/create" : "/sign-up"

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-200/60 via-indigo-200/40 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-fuchsia-200/40 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
            <Sparkles className="h-4 w-4" />
            Podcasts generados con IA en minutos
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
        >
          Tu podcast personalizado,{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            generado por IA
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl"
        >
          Describe lo que quieres escuchar y nuestra IA lo produce en minutos.
          Con voces realistas, investigación en tiempo real y personalización
          total.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg" className="h-12 gap-2 px-8 text-base">
            <Link href={ctaHref}>
              {isSignedIn ? "Crear podcast" : "Crear mi primer podcast"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 gap-2 px-8 text-base"
          >
            <Link href="#como-funciona">Ver cómo funciona</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8"
        >
          {[
            { icon: Headphones, value: "8+", label: "Formatos" },
            { icon: Zap, value: "~3 min", label: "Generación" },
            { icon: Sparkles, value: "30+", label: "Voces" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-violet-500" />
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
