// Exportaciones centralizadas de todas las plantillas de prompts
// Cada formato de podcast tiene su propia funcion generadora de prompt

import { getConversationPrompt } from "./conversation"
import { getMonologuePrompt } from "./monologue"
import { getDebatePrompt } from "./debate"
import { getNarrationPrompt } from "./narration"
import { getClassPrompt } from "./class"
import { getRoundtablePrompt } from "./roundtable"

export {
  getConversationPrompt,
  getMonologuePrompt,
  getDebatePrompt,
  getNarrationPrompt,
  getClassPrompt,
  getRoundtablePrompt,
}

// Informacion de voz para pasar a los prompts
export interface VoiceInfo {
  name: string
  gender: "male" | "female"
  role?: string
}

// Tipo compartido para los parametros de configuracion de prompts
export interface PromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
  voices?: VoiceInfo[]
}

// Mapa de formatos a sus funciones generadoras para acceso dinamico
export const promptGenerators: Record<string, (params: PromptParams) => string> = {
  conversation: getConversationPrompt,
  monologue: getMonologuePrompt,
  debate: getDebatePrompt,
  narration: getNarrationPrompt,
  class: getClassPrompt,
  roundtable: getRoundtablePrompt,
}
