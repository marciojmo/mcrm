export interface LinkifySegment {
  text: string;
  isLink: boolean;
}

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"]+/gi;
const TRAILING_PUNCTUATION = '.,;:!?';

function trimUrl(url: string) {
  let unmatchedClosing = 0;
  for (const char of url) {
    if (char === '(') unmatchedClosing--;
    if (char === ')') unmatchedClosing++;
  }
  let end = url.length;
  while (end > 0) {
    const char = url[end - 1];
    if (char === ')' && unmatchedClosing > 0) unmatchedClosing--;
    else if (!TRAILING_PUNCTUATION.includes(char)) break;
    end--;
  }
  return url.slice(0, end);
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
