import type { CategoryTerms, PageMatch } from "./types";
import { countPhrase, fold, indexOfPhrase, phraseTokens, stem, tokenize } from "./normalize";

/** A page is credible once its net score reaches this. A lone single-word hit never does. */
export const CREDIBLE_SCORE = 12;

const STRONG_PHRASE = 12;
const STRONG_WORD = 8;
const REPEAT = 2;
const REPEAT_CAP = 6;
const WEAK = 3;
const WEAK_CAP = 9;
const EXCLUDE = 10;
/** A contents or index page names many products without being one of them. */
const STRONG_CAP = 60;
const CONTENTS_REFERENCES = 3;
const CONTENTS_FACTOR = 0.5;
const SNIPPET = 110;

/** Pre-computed tokens for a term list, so a term is tokenised once, not once per page. */
export interface CompiledTerms {
  strong: string[][];
  weak: string[][];
  exclude: string[][];
}

export function compileTerms(terms: CategoryTerms): CompiledTerms {
  const compile = (list: readonly string[] = []) => list.map(phraseTokens).filter((p) => p.length > 0);
  return { strong: compile(terms.strong), weak: compile(terms.weak), exclude: compile(terms.exclude) };
}

/** True for a contents/index page: it cites several "pg60"-style page references. */
function looksLikeContents(tokens: readonly string[]): boolean {
  let references = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (/^pg\d+$/.test(tokens[i]) || (tokens[i] === "page" && /^\d+$/.test(tokens[i + 1] ?? ""))) {
      references += 1;
      if (references >= CONTENTS_REFERENCES) return true;
    }
  }
  return false;
}

export interface PageScore {
  score: number;
  strongHits: number;
  /** Token index of the first strong match, for the snippet. */
  firstHit: number;
}

/** Scores one page's tokens against a category. */
export function scorePage(tokens: readonly string[], terms: CompiledTerms): PageScore {
  let score = 0;
  let strongHits = 0;
  let firstHit = -1;

  for (const phrase of terms.strong) {
    const count = countPhrase(tokens, phrase);
    if (count === 0) continue;
    strongHits += 1;
    score += (phrase.length > 1 ? STRONG_PHRASE : STRONG_WORD) + Math.min((count - 1) * REPEAT, REPEAT_CAP);
    const at = indexOfPhrase(tokens, phrase);
    if (firstHit === -1 || at < firstHit) firstHit = at;
  }
  score = Math.min(score, STRONG_CAP);

  let weak = 0;
  for (const phrase of terms.weak) if (countPhrase(tokens, phrase) > 0) weak += WEAK;
  score += Math.min(weak, WEAK_CAP);

  for (const phrase of terms.exclude) if (countPhrase(tokens, phrase) > 0) score -= EXCLUDE;
  // A contents page lists many products it does not show; it points to them, so it ranks below them.
  if (strongHits > 0 && looksLikeContents(tokens)) score = Math.round(score * CONTENTS_FACTOR);

  return { score, strongHits, firstHit };
}

export function isCredible(result: PageScore): boolean {
  return result.strongHits >= 1 && result.score >= CREDIBLE_SCORE;
}

/** A readable excerpt around the first strong hit (or the page's start). */
export function snippetAround(text: string, tokenIndex: number): string {
  const words = fold(text).split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const from = Math.max(0, tokenIndex < 0 ? 0 : tokenIndex - 6);
  const excerpt = words.slice(from, from + 18).join(" ").slice(0, SNIPPET).trim();
  return `${from > 0 ? "…" : ""}${excerpt}…`;
}

/** Credible pages of one catalogue for a category, best first (ties: earlier page). */
export function matchPages(
  pages: readonly { page: number; text: string }[],
  terms: CompiledTerms,
  limit = 12
): PageMatch[] {
  const matches: PageMatch[] = [];
  for (const { page, text } of pages) {
    if (!text) continue;
    const result = scorePage(tokenize(text), terms);
    if (!isCredible(result)) continue;
    matches.push({ page, score: result.score, snippet: snippetAround(text, result.firstHit) });
  }
  matches.sort((a, b) => b.score - a.score || a.page - b.page);
  return matches.slice(0, limit);
}

/**
 * Free-text scoring for the viewer's search box: exact phrase, then each query
 * word, on folded and stemmed text, so "Hafele" finds "Häfele" and "runners"
 * finds "runner".
 */
export function scoreQuery(
  text: string,
  query: string,
  synonyms: Record<string, string[]> = {}
): { score: number; snippet: string } | null {
  const pageTokens = tokenize(text);
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || pageTokens.length === 0) return null;

  let score = 0;
  let firstHit = -1;
  const note = (phrase: string[]) => {
    const at = indexOfPhrase(pageTokens, phrase);
    if (at !== -1 && (firstHit === -1 || at < firstHit)) firstHit = at;
  };

  if (queryTokens.length > 1 && countPhrase(pageTokens, queryTokens) > 0) {
    score += 60;
    note(queryTokens);
  }
  const queryKey = fold(query);
  for (const token of queryTokens) {
    if (countPhrase(pageTokens, [token]) > 0) {
      score += 30;
      note([token]);
      continue;
    }
    for (const synonym of synonyms[token] ?? synonyms[queryKey] ?? []) {
      const phrase = [stem(fold(synonym))];
      if (countPhrase(pageTokens, phrase) > 0) {
        score += 20;
        note(phrase);
        break;
      }
    }
  }
  return score > 0 ? { score, snippet: snippetAround(text, firstHit) } : null;
}
