import { searchWeb } from "@/lib/tavily"
import type { PodcastConfig } from "@/types"

const MAX_CONTEXT_LENGTH = 3000

// Topics that are generally self-contained and don't need external research
const SELF_CONTAINED_PATTERNS = [
  /^(write|create|tell|make|generate)\s+(a\s+)?(story|tale|fable|narrative|fiction)/i,
  /^(escribe|crea|cuenta|haz|genera)\s+(un\s+)?(cuento|historia|relato|fábula|narrativa|ficción)/i,
  /personal\s+(experience|opinion|reflection)/i,
  /experiencia\s+personal/i,
  /creative\s+writing/i,
  /escritura\s+creativa/i,
]

function isTopicSelfContained(topic: string): boolean {
  return SELF_CONTAINED_PATTERNS.some((pattern) => pattern.test(topic.trim()))
}

/**
 * Researches the podcast topic using web search to gather relevant context.
 * Returns an empty string if the topic is self-contained or research depth is basic.
 */
export async function research(config: PodcastConfig): Promise<string> {
  // Skip research for basic depth or self-contained topics
  if (config.depth === "superficial") {
    return ""
  }

  if (isTopicSelfContained(config.prompt)) {
    return ""
  }

  // For narration/story formats, skip research unless explicitly requested via sources
  if (config.format === "NARRATION" && !config.sources?.length) {
    return ""
  }

  try {
    const searchDepth = config.depth === "expert" ? "advanced" : "basic"
    const maxResults = config.depth === "expert" ? 8 : 5

    const response = await searchWeb({
      query: config.prompt,
      maxResults,
      searchDepth,
      topic: "general",
      includeRawContent: false,
    })

    if (!response.results || response.results.length === 0) {
      return ""
    }

    // Build context from search results
    let context = "=== RESEARCH CONTEXT ===\n\n"

    for (const result of response.results) {
      const entry = `[${result.title}] (${result.url})\n${result.content}\n\n`

      // Stop if we'd exceed the character limit
      if (context.length + entry.length > MAX_CONTEXT_LENGTH) {
        break
      }

      context += entry
    }

    // Trim to max length as a safety measure
    if (context.length > MAX_CONTEXT_LENGTH) {
      context = context.slice(0, MAX_CONTEXT_LENGTH)
    }

    return context
  } catch (error) {
    console.error("[research] Web search failed, continuing without research context:", error)
    return ""
  }
}
