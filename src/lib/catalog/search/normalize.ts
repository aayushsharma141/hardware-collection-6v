/**
 * Text normalisation shared by the catalogue indexer, the category matcher and
 * the in-viewer search, so the three agree on what counts as the same word.
 */

/** Lowercases, strips accents (Häfele -> hafele) and turns punctuation into spaces. */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * A deliberately light stemmer: enough to make "runners", "hinges" and
 * "closing" meet "runner", "hinge" and "close", without the surprises of a full
 * Porter stem on product names. Words that merely end in "ss"/"us"/"is" are
 * left alone ("glass", "brass", "bus").
 */
export function stem(token: string): string {
  if (token.length <= 3 || /\d/.test(token)) return token;
  if (/(ss|us|is)$/.test(token)) return token;
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (/(ches|shes|xes|zes)$/.test(token)) return token.slice(0, -2);
  if (token.endsWith("ing") && token.length > 5) {
    const base = token.slice(0, -3);
    if (/(.)\1$/.test(base)) return base.slice(0, -1);
    return base.endsWith("v") || base.endsWith("s") ? `${base}e` : base;
  }
  if (token.endsWith("s")) return token.slice(0, -1);
  return token;
}

export function tokenize(value: string): string[] {
  const folded = fold(value);
  return folded ? folded.split(" ").map(stem) : [];
}

/** A phrase as stemmed tokens, for adjacency matching. */
export function phraseTokens(phrase: string): string[] {
  return tokenize(phrase);
}

/** Occurrences of `phrase` as consecutive tokens in `tokens`. */
export function countPhrase(tokens: readonly string[], phrase: readonly string[]): number {
  if (phrase.length === 0 || tokens.length < phrase.length) return 0;
  let count = 0;
  for (let i = 0; i <= tokens.length - phrase.length; i++) {
    let hit = true;
    for (let j = 0; j < phrase.length; j++) {
      if (tokens[i + j] !== phrase[j]) {
        hit = false;
        break;
      }
    }
    if (hit) {
      count += 1;
      i += phrase.length - 1;
    }
  }
  return count;
}

/** Index of the first occurrence of `phrase` in `tokens`, or -1. */
export function indexOfPhrase(tokens: readonly string[], phrase: readonly string[]): number {
  if (phrase.length === 0) return -1;
  for (let i = 0; i <= tokens.length - phrase.length; i++) {
    if (phrase.every((token, j) => tokens[i + j] === token)) return i;
  }
  return -1;
}
