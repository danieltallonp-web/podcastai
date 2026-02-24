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

// Tipo compartido para los parametros de configuracion de prompts
export interface PromptParams {
  topic: string
  duration: number
  tone: string
  language: string
  numberOfVoices: number
  researchContext?: string
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
