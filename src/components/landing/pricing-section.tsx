"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfecto para probar",
    features: [
      "3 podcasts al mes",
      "Duración máx. 5 minutos",
      "Formatos básicos",
      "2 voces por podcast",
      "Calidad estándar",
    ],
    cta: "Empezar gratis",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.99",
    description: "Para creadores frecuentes",
    features: [
      "25 podcasts al mes",
      "Duración máx. 30 minutos",
      "Todos los formatos",
      "4 voces por podcast",
      "Alta calidad",
      "Investigación web",
      "Presets personalizados",
      "Descargas ilimitadas",
    ],
    cta: "Empezar con Pro",
    href: "/sign-up",
    popular: true,
  },
  {
    name: "Premium",
    price: "19.99",
    description: "Para los más exigentes",
    features: [
      "Podcasts ilimitados",
      "Duración máx. 60 minutos",
      "Todos los formatos",
      "6 voces por podcast",
      "Máxima calidad",
      "Investigación web avanzada",
      "Presets ilimitados",
      "Clonación de voz",
      "Fuentes conectadas (RSS)",
      "API de acceso",
    ],
    cta: "Empezar con Premium",
    href: "/sign-up",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="precios" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Precios simples, sin sorpresas
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Empieza gratis y escala cuando lo necesites.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative rounded-2xl border bg-white p-8 shadow-sm",
                plan.popular
                  ? "border-violet-300 shadow-lg shadow-violet-100 ring-1 ring-violet-300"
                  : "border-gray-200"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Más popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
