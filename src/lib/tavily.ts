// Tavily API client for web search
const TAVILY_API_URL = "https://api.tavily.com/search"

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
  publishedDate?: string
}

export interface TavilySearchResponse {
  query: string
  results: TavilySearchResult[]
  responseTime: number
}

export async function searchWeb(params: {
  query: string
  maxResults?: number
  searchDepth?: "basic" | "advanced"
  topic?: "general" | "news"
  days?: number
  includeRawContent?: boolean
}): Promise<TavilySearchResponse> {
  const {
    query,
    maxResults = 5,
    searchDepth = "advanced",
    topic = "general",
    days,
    includeRawContent = false,
  } = params

  const response = await fetch(TAVILY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY!,
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      topic,
      days,
      include_raw_content: includeRawContent,
    }),
  })

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    query: data.query,
    results: data.results.map((r: Record<string, unknown>) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score,
      publishedDate: r.published_date,
    })),
    responseTime: data.response_time,
  }
}
