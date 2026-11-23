export interface LinkifySegment {
  text: string;
  isLink: boolean;
}

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?]$/;

function count(text: string, char: string) {
  return text.split(char).length - 1;
}

function trimUrl(url: string) {
  let trimmed = url;
  while (
    TRAILING_PUNCTUATION.test(trimmed) ||
    (trimmed.endsWith(')') && count(trimmed, ')') > count(trimmed, '('))
  )
    trimmed = trimmed.slice(0, -1);
  return trimmed;
}

export function linkify(text: string): LinkifySegment[] {
  const segments: LinkifySegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const url = trimUrl(match[0]);
    if (!/^https?:\/\/[^/?#]/i.test(url)) continue;
    if (match.index > cursor)
      segments.push({ text: text.slice(cursor, match.index), isLink: false });
    segments.push({ text: url, isLink: true });
    cursor = match.index + url.length;
  }
  if (cursor < text.length)
    segments.push({ text: text.slice(cursor), isLink: false });
  return segments;
}
