// Pure keyword-scoring matcher — no LLM, no external API call (the
// client's explicit "offline" choice for Task 5: no API key, no
// per-message cost, no third-party dependency). Deliberately simple and
// debuggable: given a visitor's message and the published chatbot_faqs
// rows, score every FAQ by token overlap and return the best match above a
// confidence floor, or null if nothing clears it.

export interface MatchableFaq {
  id: string;
  question: string;
  answer: string;
  keywords: string | null;
}

export interface MatchResult {
  faq: MatchableFaq;
  score: number;
}

// Below this fraction of the visitor's own words being found anywhere in a
// FAQ's text, the match is treated as too weak to answer confidently — the
// route logs it as unanswered instead of returning a guess. Tuned by eye
// against the seed FAQ set (supabase/migrations/20260924100001_chatbot_faq_seed.sql):
// short, on-topic questions ("What is the AI course?") score well above
// this; unrelated chit-chat ("hello", "thanks") correctly falls below it.
export const MIN_CONFIDENCE = 0.34;

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "am",
  "do", "does", "did", "i", "you", "your", "we", "our", "it", "its",
  "to", "of", "in", "on", "for", "and", "or", "with", "about", "what",
  "how", "can", "could", "would", "will", "me", "my", "this", "that",
  "there", "have", "has", "had",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

// Question/keyword tokens count for more than answer tokens — a match on
// "germany" appearing in the FAQ's own question is a stronger signal of
// relevance than "germany" merely appearing somewhere in a long answer.
const QUESTION_WEIGHT = 3;
const KEYWORD_WEIGHT = 3;
const ANSWER_WEIGHT = 1;

function buildWeightedTokenSet(faq: MatchableFaq): Map<string, number> {
  const weights = new Map<string, number>();

  function add(tokens: string[], weight: number) {
    for (const token of tokens) {
      weights.set(token, Math.max(weights.get(token) ?? 0, weight));
    }
  }

  add(tokenize(faq.question), QUESTION_WEIGHT);
  if (faq.keywords) add(tokenize(faq.keywords), KEYWORD_WEIGHT);
  add(tokenize(faq.answer), ANSWER_WEIGHT);

  return weights;
}

/**
 * Fraction (0..1) of the visitor's own message tokens that matched
 * somewhere in this FAQ, weighted by where the match landed. A message
 * entirely made of matched, high-weight tokens scores near 1; one word
 * matching out of ten scores low even if that one word hit a keyword.
 */
function scoreFaq(messageTokens: string[], faq: MatchableFaq): number {
  if (messageTokens.length === 0) return 0;
  const faqTokens = buildWeightedTokenSet(faq);

  let matched = 0;
  for (const token of messageTokens) {
    const weight = faqTokens.get(token);
    if (weight) matched += weight;
  }

  return matched / (messageTokens.length * QUESTION_WEIGHT);
}

export function findBestMatch(message: string, faqs: MatchableFaq[]): MatchResult | null {
  const messageTokens = tokenize(message);
  if (messageTokens.length === 0 || faqs.length === 0) return null;

  let best: MatchResult | null = null;
  for (const faq of faqs) {
    const score = scoreFaq(messageTokens, faq);
    if (!best || score > best.score) best = { faq, score };
  }

  return best;
}
