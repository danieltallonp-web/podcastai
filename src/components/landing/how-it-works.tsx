"use client"

import { MessageSquare, Cpu, Play } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Describe tu podcast",
    description:
      "Cuéntanos qué quieres escuchar. Puede ser tan simple como una frase o tan detallado como quieras.",
    color: "from-violet-500 to-purple-600",
  },
  {
    step: "02",
    icon: Cpu,
    title: "La IA lo produce",
    description:
      "Investigamos, escribimos el guion, generamos las voces y producimos el audio completo.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    step: "03",
    icon: Play,
    title: "Escucha y disfruta",
    description:
      "Tu podcast personalizado está listo en minutos. Escúchalo, descárgalo o compártelo.",
    color: "from-fuchsia-500 to-pink-600",
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Así de fácil
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            En 3 pasos tienes tu podcast listo para escuchar.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-12 hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-gray-200 to-gray-200 md:block" />
              )}

              <div
                className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
              >
                <step.icon className="h-8 w-8" />
              </div>

              <div className="mb-2 text-sm font-bold tracking-wide text-violet-600">
                PASO {step.step}
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
