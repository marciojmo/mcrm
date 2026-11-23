import type { BoardUser } from '@/types/board';

export const MENTION_HIGHLIGHT_CLASS = 'rounded bg-primary/10 text-primary';

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getMentionNames(mentionedIds: string[], users: BoardUser[]) {
  return mentionedIds
    .map((id) => users.find((user) => user.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .map((name) => `@${name}`);
}

export function isCompletedMention(
  query: string,
  names: string[],
  users: BoardUser[]
) {
  const typed = `@${query}`;
  const isAfterMention = names.some((name) => {
    const rest = typed.slice(name.length);
    return typed.startsWith(name) && (rest === '' || /^\s/.test(rest));
  });
  const hasOtherMatch = users.some(
    (user) =>
      !names.includes(`@${user.name}`) &&
      user.name.toLowerCase().startsWith(query.toLowerCase())
  );
  return isAfterMention && !hasOtherMatch;
}

export function splitByMentions(text: string, names: string[]) {
  if (names.length === 0) return [text];
  return text.split(new RegExp(`(${names.map(escapeRegExp).join('|')})`));
}
