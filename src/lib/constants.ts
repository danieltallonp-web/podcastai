import { type Plan } from "@prisma/client"

// ==========================================
// FORMATOS DE PODCAST
// ==========================================

export const PODCAST_FORMATS = [
  { id: "MONOLOGUE", label: "Monólogo", icon: "🎙️", description: "Una sola voz narrando" },
  { id: "CONVERSATION", label: "Conversación", icon: "💬", description: "2 personas charlando" },
  { id: "DEBATE", label: "Debate", icon: "⚔️", description: "Posturas enfrentadas" },
  { id: "NARRATION", label: "Narración/Cuento", icon: "📖", description: "Historia dramatizada" },
  { id: "CLASS", label: "Clase", icon: "🎓", description: "Lección magistral" },
  { id: "ROUNDTABLE", label: "Mesa redonda", icon: "🪑", description: "3+ personas discutiendo" },
  { id: "INTERVIEW", label: "Entrevista", icon: "🎤", description: "Pregunta y respuesta" },
  { id: "INTERACTIVE", label: "Elige tu aventura", icon: "🎮", description: "Narrativa interactiva" },
] as const

// ==========================================
// DURACIONES
// ==========================================

export const DURATION_OPTIONS = [
  { value: 5, label: "5 min", description: "Breve" },
  { value: 15, label: "15 min", description: "Estándar" },
  { value: 30, label: "30 min", description: "Largo" },
  { value: 60, label: "60 min", description: "Extenso" },
] as const

// ==========================================
// TONOS
// ==========================================

export const TONE_OPTIONS = [
  { id: "serious", label: "Serio", icon: "📰" },
  { id: "casual", label: "Casual", icon: "☕" },
  { id: "funny", label: "Divertido", icon: "😄" },
  { id: "inspiring", label: "Inspirador", icon: "✨" },
] as const

export const ADVANCED_TONE_OPTIONS = [
  { id: "formal", label: "Formal" },
  { id: "casual", label: "Casual" },
  { id: "humorous", label: "Humorístico" },
  { id: "didactic", label: "Didáctico" },
  { id: "dramatic", label: "Dramático" },
  { id: "inspiring", label: "Inspirador" },
  { id: "sarcastic", label: "Sarcástico" },
  { id: "intimate", label: "Íntimo" },
  { id: "epic", label: "Épico" },
] as const

// ==========================================
// IDIOMAS
// ==========================================

export const LANGUAGE_OPTIONS = [
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "it", label: "Italiano", flag: "🇮🇹" },
] as const

// ==========================================
// MÚSICA DE FONDO
// ==========================================

export const MUSIC_STYLES = [
  { id: "none", label: "Ninguna" },
  { id: "lofi", label: "Lo-fi" },
  { id: "corporate", label: "Corporativa" },
  { id: "epic", label: "Épica" },
  { id: "acoustic", label: "Acústica" },
  { id: "electronic", label: "Electrónica" },
  { id: "jazz", label: "Jazz" },
  { id: "ambient", label: "Ambiental" },
] as const

// ==========================================
// EFECTOS DE SONIDO
// ==========================================

export const SFX_LEVELS = [
  { id: "none", label: "Ninguno" },
  { id: "subtle", label: "Sutiles" },
  { id: "moderate", label: "Moderados" },
  { id: "immersive", label: "Inmersivos" },
] as const

// ==========================================
// INTRO/OUTRO
// ==========================================

export const INTRO_STYLES = [
  { id: "none", label: "Ninguno", duration: 0 },
  { id: "brief", label: "Breve", duration: 5 },
  { id: "standard", label: "Estándar", duration: 15 },
  { id: "produced", label: "Producido", duration: 30 },
] as const

// ==========================================
// CALIDAD DE AUDIO
// ==========================================

export const AUDIO_QUALITY_OPTIONS = [
  { id: "standard", label: "Estándar", bitrate: "128kbps", format: "MP3" },
  { id: "high", label: "Alta", bitrate: "256kbps", format: "MP3", minPlan: "PRO" as Plan },
  { id: "max", label: "Máxima", bitrate: "320kbps", format: "FLAC", minPlan: "PREMIUM" as Plan },
] as const

// ==========================================
// AMBIENTACIONES (para cuentos)
// ==========================================

export const STORY_SETTINGS = [
  { id: "magic_forest", label: "Bosque mágico", icon: "🌳" },
  { id: "space", label: "Espacio", icon: "🚀" },
  { id: "future_city", label: "Ciudad futurista", icon: "🏙️" },
  { id: "underwater", label: "Mundo submarino", icon: "🐠" },
  { id: "medieval", label: "Medieval", icon: "🏰" },
  { id: "custom", label: "Personalizado", icon: "✏️" },
] as const

// ==========================================
// TEMÁTICAS / MORALEJAS (para cuentos)
// ==========================================

export const STORY_THEMES = [
  { id: "friendship", label: "Amistad" },
  { id: "bravery", label: "Valentía" },
  { id: "diversity", label: "Diversidad" },
  { id: "environment", label: "Medio ambiente" },
  { id: "science", label: "Ciencia" },
  { id: "creativity", label: "Creatividad" },
] as const

// ==========================================
// TEMAS DE INTERÉS (onboarding)
// ==========================================

export const INTEREST_TOPICS = [
  { id: "technology", label: "Tecnología", icon: "💻" },
  { id: "marketing", label: "Marketing", icon: "📈" },
  { id: "business", label: "Negocios", icon: "💼" },
  { id: "science", label: "Ciencia", icon: "🔬" },
  { id: "health", label: "Salud", icon: "🏥" },
  { id: "finance", label: "Finanzas", icon: "💰" },
  { id: "education", label: "Educación", icon: "📚" },
  { id: "entertainment", label: "Entretenimiento", icon: "🎬" },
  { id: "sports", label: "Deportes", icon: "⚽" },
  { id: "politics", label: "Política", icon: "🏛️" },
  { id: "culture", label: "Cultura", icon: "🎭" },
  { id: "ai", label: "Inteligencia Artificial", icon: "🤖" },
  { id: "design", label: "Diseño", icon: "🎨" },
  { id: "stories", label: "Historias y cuentos", icon: "📖" },
  { id: "philosophy", label: "Filosofía", icon: "🧠" },
  { id: "travel", label: "Viajes", icon: "✈️" },
] as const

// ==========================================
// PRESETS DEL SISTEMA
// ==========================================

export const SYSTEM_PRESETS = [
  {
    name: "Daily Brief",
    description: "Resumen diario breve y formal de 5 minutos",
    icon: "📰",
    config: {
      format: "MONOLOGUE",
      duration: 5,
      tone: ["serious"],
      language: "es",
      voices: 1,
      music: "corporate",
      musicVolume: 0.1,
      sfx: "none",
      intro: "brief",
      depth: "superficial",
    },
  },
  {
    name: "Coffee Talk",
    description: "Conversación casual entre dos personas por 15 minutos",
    icon: "☕",
    config: {
      format: "CONVERSATION",
      duration: 15,
      tone: ["casual", "funny"],
      language: "es",
      voices: 2,
      music: "lofi",
      musicVolume: 0.15,
      sfx: "none",
      intro: "standard",
      depth: "intermediate",
    },
  },
  {
    name: "Deep Dive",
    description: "Análisis experto en profundidad de 30 minutos",
    icon: "🔍",
    config: {
      format: "MONOLOGUE",
      duration: 30,
      tone: ["didactic"],
      language: "es",
      voices: 1,
      music: "none",
      musicVolume: 0,
      sfx: "none",
      intro: "standard",
      depth: "expert",
    },
  },
  {
    name: "The Debate",
    description: "Debate intenso entre 2-3 expertos por 20 minutos",
    icon: "⚔️",
    config: {
      format: "DEBATE",
      duration: 20,
      tone: ["serious"],
      language: "es",
      voices: 2,
      music: "none",
      musicVolume: 0,
      sfx: "none",
      intro: "standard",
      depth: "expert",
    },
  },
  {
    name: "Bedtime Story",
    description: "Cuento cálido y suave de 10 minutos para dormir",
    icon: "🌙",
    config: {
      format: "NARRATION",
      duration: 10,
      tone: ["intimate"],
      language: "es",
      voices: 2,
      music: "ambient",
      musicVolume: 0.2,
      sfx: "immersive",
      intro: "brief",
      depth: "intermediate",
      tensionLevel: "very_soft",
    },
  },
  {
    name: "News Roundup",
    description: "Mesa redonda de noticias con 3 presentadores",
    icon: "📡",
    config: {
      format: "ROUNDTABLE",
      duration: 20,
      tone: ["serious", "casual"],
      language: "es",
      voices: 3,
      music: "corporate",
      musicVolume: 0.1,
      sfx: "none",
      intro: "produced",
      depth: "intermediate",
    },
  },
  {
    name: "Study Session",
    description: "Clase magistral didáctica de 30-60 minutos",
    icon: "🎓",
    config: {
      format: "CLASS",
      duration: 30,
      tone: ["didactic"],
      language: "es",
      voices: 1,
      music: "none",
      musicVolume: 0,
      sfx: "none",
      intro: "standard",
      depth: "expert",
      generateTranscript: true,
    },
  },
  {
    name: "Audio Movie",
    description: "Narración dramatizada épica con múltiples personajes",
    icon: "🎬",
    config: {
      format: "NARRATION",
      duration: 45,
      tone: ["dramatic", "epic"],
      language: "es",
      voices: 4,
      music: "epic",
      musicVolume: 0.25,
      sfx: "immersive",
      intro: "produced",
      depth: "expert",
    },
  },
] as const

// ==========================================
// LÍMITES DE PLANES
// ==========================================

export const PLAN_LIMITS = {
  FREE: {
    podcastsPerMonth: 3,
    maxDuration: 15,
    maxVoices: 1,
    advancedMode: false,
    customPresets: 0,
    ownSources: false,
    offlineDownload: false,
    voiceCloning: false,
    videoGeneration: false,
    highlightClips: false,
    rssSources: 0,
    maxAudioQuality: "standard" as const,
    priorityQueue: false,
    interactiveNarration: false,
  },
  PRO: {
    podcastsPerMonth: 30,
    maxDuration: 60,
    maxVoices: 4,
    advancedMode: true,
    customPresets: 5,
    ownSources: true,
    offlineDownload: true,
    voiceCloning: false,
    videoGeneration: false,
    highlightClips: true,
    rssSources: 3,
    maxAudioQuality: "high" as const,
    priorityQueue: false,
    interactiveNarration: false,
  },
  PREMIUM: {
    podcastsPerMonth: Infinity,
    maxDuration: 90,
    maxVoices: 6,
    advancedMode: true,
    customPresets: Infinity,
    ownSources: true,
    offlineDownload: true,
    voiceCloning: true,
    videoGeneration: true,
    highlightClips: true,
    rssSources: Infinity,
    maxAudioQuality: "max" as const,
    priorityQueue: true,
    interactiveNarration: true,
  },
} as const

export type PlanLimits = (typeof PLAN_LIMITS)[keyof typeof PLAN_LIMITS]

// ==========================================
// PRICING
// ==========================================

export const PRICING = [
  {
    name: "Free",
    plan: "FREE" as Plan,
    price: 0,
    description: "Para probar la plataforma",
    features: [
      "3 podcasts al mes",
      "Hasta 15 minutos",
      "1 voz por podcast",
      "Modo simple",
      "Calidad estándar (128kbps)",
    ],
    limitations: [
      "Sin modo avanzado",
      "Sin descargas",
      "Sin fuentes propias",
    ],
  },
  {
    name: "Pro",
    plan: "PRO" as Plan,
    price: 9.99,
    description: "Para creadores frecuentes",
    popular: true,
    features: [
      "30 podcasts al mes",
      "Hasta 60 minutos",
      "Hasta 4 voces",
      "Modo avanzado completo",
      "5 presets personalizados",
      "Subir PDFs y URLs como fuente",
      "Descarga offline",
      "Clips destacados",
      "3 fuentes RSS",
      "Calidad alta (256kbps)",
    ],
    limitations: [
      "Sin clonación de voz",
      "Sin generación de vídeo",
    ],
  },
  {
    name: "Premium",
    plan: "PREMIUM" as Plan,
    price: 19.99,
    description: "Sin límites, experiencia completa",
    features: [
      "Podcasts ilimitados",
      "Hasta 90 minutos",
      "Hasta 6 voces",
      "Todo del plan Pro",
      "Presets ilimitados",
      "Clonación de voz propia",
      "Generación de vídeo",
      "Narración interactiva",
      "Fuentes RSS ilimitadas",
      "Calidad máxima (320kbps/FLAC)",
      "Cola prioritaria",
    ],
    limitations: [],
  },
] as const

// ==========================================
// GENERATION STATUS LABELS
// ==========================================

export const STATUS_LABELS = {
  QUEUED: { label: "En cola", description: "Esperando para comenzar...", progress: 0 },
  RESEARCHING: { label: "Investigando", description: "Buscando información relevante...", progress: 15 },
  SCRIPTING: { label: "Escribiendo guion", description: "Creando el contenido del podcast...", progress: 40 },
  GENERATING_AUDIO: { label: "Generando audio", description: "Sintetizando voces con IA...", progress: 65 },
  POST_PRODUCING: { label: "Produciendo", description: "Ensamblando el podcast final...", progress: 85 },
  READY: { label: "¡Listo!", description: "Tu podcast está listo para escuchar", progress: 100 },
  FAILED: { label: "Error", description: "Algo salió mal. Intenta de nuevo.", progress: 0 },
} as const
