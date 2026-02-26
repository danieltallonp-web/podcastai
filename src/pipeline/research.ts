import { searchWeb } from "@/lib/tavily"
import type { PodcastConfig } from "@/types"

// Enhanced context limits for professional research
const CONTEXT_LIMITS = {
  superficial: 0,
  intermediate: 6000,
  expert: 12000,
} as const

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
 * Generates optimized search queries based on format and topic
 */
function generateSearchQueries(
  topic: string,
  format: string,
  depth: string
): Array<{ query: string; tavilyTopic: "general" | "news" }> {
  const queries: Array<{ query: string; tavilyTopic: "general" | "news" }> = [
    { query: topic, tavilyTopic: "general" },
  ]

  // Format-specific search strategies for better coverage
  if (format === "DEBATE") {
    queries.push(
      { query: `${topic} arguments pros cons`, tavilyTopic: "general" },
      { query: `${topic} different perspectives`, tavilyTopic: "general" }
    )
  } else if (format === "CLASS") {
    queries.push(
      { query: `${topic} education tutorial guide`, tavilyTopic: "general" },
      { query: `${topic} best practices fundamentals`, tavilyTopic: "general" }
    )
  } else if (format === "INTERVIEW") {
    queries.push(
      { query: `${topic} experts insights`, tavilyTopic: "general" },
      { query: `${topic} case studies examples`, tavilyTopic: "general" }
    )
  } else if (format === "ROUNDTABLE") {
    queries.push(
      { query: `${topic} discussion analysis`, tavilyTopic: "general" },
      { query: `${topic} current trends news`, tavilyTopic: "news" }
    )
  } else {
    // General coverage for other formats
    queries.push({ query: `${topic} recent news trends`, tavilyTopic: "news" })
  }

  if (depth === "expert") {
    queries.push(
      { query: `${topic} research study findings`, tavilyTopic: "general" },
      { query: `${topic} in-depth analysis comparison`, tavilyTopic: "general" }
    )
  }

  return queries
}

/**
 * Deduplicates and prioritizes research results
 */
function deduplicateResults(
  results: Array<{ title: string; url: string; content: string }>
) {
  const seen = new Set<string>()
  const deduped: Array<{ title: string; url: string; content: string }> = []

  for (const result of results) {
    // Use domain + title as unique identifier to avoid duplicates
    const domain = new URL(result.url).hostname
    const id = `${domain}::${result.title.toLowerCase()}`

    if (!seen.has(id) && result.content.trim().length > 50) {
      seen.add(id)
      deduped.push(result)
    }
  }

  return deduped
}

/**
 * Synthesizes multiple research results into coherent context
 */
function synthesizeContext(results: Array<{ title: string; url: string; content: string }>): string {
  if (results.length === 0) return ""

  let context = "=== RESEARCH CONTEXT (Professional Synthesis) ===\n\n"

  // Organize by source for clarity
  for (const result of results) {
    const entry = `## ${result.title}\nSource: ${result.url}\n${result.content}\n\n`
    context += entry
  }

  return context
}

/**
 * Researches the podcast topic using professional multi-query search.
 * Implements depth-based research with format-specific strategies.
 * Returns comprehensive context for script generation.
 */
export async function research(config: PodcastConfig): Promise<string> {
  const depth = config.depth || "intermediate"
  const maxContextLength = CONTEXT_LIMITS[depth]

  // Skip research for superficial depth
  if (maxContextLength === 0) {
    return ""
  }

  // Skip research for self-contained topics
  if (isTopicSelfContained(config.prompt)) {
    return ""
  }

  // For narration/story formats, skip research unless explicitly requested
  if (config.format === "NARRATION" && !config.sources?.length) {
    return ""
  }

  try {
    // Generate format-aware search queries
    const searchQueries = generateSearchQueries(config.prompt, config.format, depth)

    // Determine search intensity based on depth
    const searchDepth = depth === "expert" ? "advanced" : "basic"
    const resultsPerQuery = depth === "expert" ? 5 : 3

    // Execute multiple searches in parallel
    const allResults: Array<{ title: string; url: string; content: string }> = []

    const searchPromises = searchQueries.map((q) =>
      searchWeb({
        query: q.query,
        maxResults: resultsPerQuery,
        searchDepth,
        topic: q.tavilyTopic,
        includeRawContent: false,
      })
    )

    const responses = await Promise.allSettled(searchPromises)

    // Collect results from successful searches
    for (const response of responses) {
      if (response.status === "fulfilled" && response.value.results) {
        allResults.push(...response.value.results)
      }
    }

    if (allResults.length === 0) {
      console.warn("[research] No results found for topic:", config.prompt)
      return ""
    }

    // Deduplicate and synthesize results
    const deduped = deduplicateResults(allResults)
    let context = synthesizeContext(deduped)

    // Enforce max length limit
    if (context.length > maxContextLength) {
      // Truncate at a natural boundary (double newline)
      context = context.slice(0, maxContextLength)
      const lastBreak = context.lastIndexOf("\n\n")
      if (lastBreak > maxContextLength * 0.8) {
        context = context.slice(0, lastBreak)
      }
    }

    console.info(
      `[research] Gathered ${deduped.length} sources for "${config.prompt}" (${depth} depth)`
    )

    return context
  } catch (error) {
    console.error("[research] Web search failed, continuing without research context:", error)
    return ""
  }
}
