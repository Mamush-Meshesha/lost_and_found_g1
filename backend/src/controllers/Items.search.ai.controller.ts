import { Agent } from "@cursor/sdk";
import { truncateQuery } from "../utils/truncateQuery";

export type MatchCandidate = {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
};

export type AiMatch = {
  id: string;
  score: number;
  item?: MatchCandidate;
};

export type AiMatchResult = {
  matchFound: boolean;
  matches: AiMatch[];
  queryUsed: string;
  error?: string;
};

const THRESHOLD = Number(process.env.MATCH_THRESHOLD ?? 0.75);
const CANDIDATE_LIMIT = Number(process.env.MATCH_CANDIDATE_LIMIT ?? 10);

type ItemLike = {
  _id: unknown;
  title: string;
  description: string;
  location?: { address?: string };
  status: string;
};


export async function runSearchAiMatch(
  rawQuery: string,
  filteredItems: ItemLike[]
): Promise<AiMatchResult> {
  const maxLen = Number(process.env.AI_QUERY_MAX_LENGTH ?? 500);
  const query = truncateQuery(rawQuery, maxLen);

  const candidates: MatchCandidate[] = filteredItems
    .slice(0, CANDIDATE_LIMIT)
    .map((item) => ({
      id: String(item._id),
      title: item.title,
      description: item.description,
      location: item.location?.address ?? "",
      status: item.status,
    }));

  if (!query || candidates.length === 0) {
    return { matchFound: false, matches: [], queryUsed: query };
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return {
      matchFound: false,
      matches: [],
      queryUsed: query,
      error: "CURSOR_API_KEY not set — skipped AI match",
    };
  }

  const prompt = [
    "You are a lost-and-found match scorer.",
    "Given a search query and candidate items, score how well each candidate matches the query.",
    `Return ONLY valid JSON (no markdown): {"matches":[{"id":"<candidate id>","score":0.0}]}`,
    `Score is 0 to 1. Only include candidates with score >= ${THRESHOLD}.`,
    "",
    `QUERY: ${query}`,
    "",
    `CANDIDATES: ${JSON.stringify(candidates)}`,
  ].join("\n");

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: process.env.CURSOR_MODEL ?? "composer-2.5" },
      cloud: { repos: [] },
    });

    const text = String(result.result ?? "");
    const parsed = parseMatchesJson(text);
    const byId = new Map(candidates.map((c) => [c.id, c]));

    const matches: AiMatch[] = parsed
      .filter((m) => m.score >= THRESHOLD && byId.has(m.id))
      .map((m) => ({
        id: m.id,
        score: m.score,
        item: byId.get(m.id),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      matchFound: matches.length > 0,
      matches,
      queryUsed: query,
    };
  } catch (err) {
    return {
      matchFound: false,
      matches: [],
      queryUsed: query,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function parseMatchesJson(
  text: string
): Array<{ id: string; score: number }> {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];

  try {
    const raw = JSON.parse(text.slice(start, end + 1)) as {
      matches?: Array<{ id?: string; score?: number }>;
    };
    if (!Array.isArray(raw.matches)) return [];
    return raw.matches
      .filter((m) => typeof m.id === "string" && typeof m.score === "number")
      .map((m) => ({ id: m.id as string, score: m.score as number }));
  } catch {
    return [];
  }
}