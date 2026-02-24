"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María García",
    role: "Creadora de contenido",
    content:
      "Increíble. Genero un resumen de noticias cada mañana en 3 minutos. Antes me costaba horas preparar el guion.",
    avatar: "MG",
  },
  {
    name: "Carlos López",
    role: "Profesor universitario",
    content:
      "Uso PodcastAI para crear material de estudio en audio para mis alumnos. El formato clase es perfecto.",
    avatar: "CL",
  },
  {
    name: "Ana Rodríguez",
    role: "Emprendedora",
    content:
      "El modo debate es genial para explorar ideas desde diferentes perspectivas. Lo uso antes de tomar decisiones importantes.",
    avatar: "AR",
  },
]

export function Testimonials() {
  return (
    <section className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Miles de personas ya crean contenido de audio con IA.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mb-6 text-gray-600">{testimonial.content}</p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
