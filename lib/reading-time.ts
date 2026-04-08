const DEFAULT_WORDS_PER_MINUTE = 220;

function countWords(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

export function estimateReadingMinutes(text: string, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE): number {
  const words = countWords(text);
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function estimateReadingLabel(text: string, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE): string {
  const minutes = estimateReadingMinutes(text, wordsPerMinute);
  return `${minutes} min read`;
}

