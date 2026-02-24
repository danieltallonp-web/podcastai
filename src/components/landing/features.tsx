"use client"

import {
  Brain,
  Globe,
  Mic2,
  Sliders,
  BookOpen,
  Headphones,
  Wand2,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "Guiones inteligentes",
    description:
      "Claude genera guiones estructurados y coherentes adaptados a tu tema y estilo.",
  },
  {
    icon: Mic2,
    title: "Voces realistas",
    description:
      "Más de 30 voces de ElevenLabs en múltiples idiomas. Conversaciones, debates y más.",
  },
  {
    icon: Globe,
    title: "Investigación en tiempo real",
    description:
      "Contenido actualizado con búsqueda web integrada. Noticias, tendencias y datos recientes.",
  },
  {
    icon: Sliders,
    title: "Personalización total",
    description:
      "Controla formato, tono, duración, voces, música y hasta la narrativa de tu podcast.",
  },
  {
    icon: BookOpen,
    title: "8 formatos disponibles",
    description:
      "Monólogo, conversación, debate, narración, clase, mesa redonda, entrevista e interactivo.",
  },
  {
    icon: Users,
    title: "Multi-voz",
    description:
      "Hasta 6 voces diferentes con personalidades únicas para cada personaje.",
  },
  {
    icon: Wand2,
    title: "Presets inteligentes",
    description:
      "Plantillas prediseñadas: Daily Brief, Deep Dive, Coffee Talk, Audio Movie y más.",
  },
  {
    icon: Headphones,
    title: "Player integrado",
    description:
      "Reproduce sin interrupciones mientras navegas. Control de velocidad, cola y favoritos.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Todo lo que necesitas para crear podcasts increíbles
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Tecnología de punta combinada para generar contenido de audio de
            calidad profesional.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-violet-50 p-3 text-violet-600 transition-colors group-hover:bg-violet-100">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
