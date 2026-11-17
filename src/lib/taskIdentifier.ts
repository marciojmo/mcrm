const BOARD_KEY_LENGTH = 4;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const TASK_IDENTIFIER_PATTERN = /\b([A-Z]{4})-(\d{1,9})\b/g;
const TASK_IDENTIFIER_SPLITTER = /\b([A-Z]{4}-\d{1,9})\b/;

export function formatTaskIdentifier(boardKey: string, taskNumber: number) {
  return `${boardKey}-${taskNumber}`;
}

export function parseTaskIdentifiers(text: string) {
  return [...text.matchAll(TASK_IDENTIFIER_PATTERN)].map(
    ([, key, taskNumber]) => ({ key, number: Number(taskNumber) })
  );
}

export function splitByTaskIdentifiers(text: string) {
  return text.split(TASK_IDENTIFIER_SPLITTER);
}

export function listBoardKeyCandidates(name: string) {
  const base = name
    .normalize('NFD')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, BOARD_KEY_LENGTH)
    .padEnd(BOARD_KEY_LENGTH, 'X');
  const prefix = base.slice(0, 3);
  const shortPrefix = base.slice(0, 2);
  return [
    base,
    ...[...LETTERS].map((letter) => prefix + letter),
    ...[...LETTERS].flatMap((first) =>
      [...LETTERS].map((second) => shortPrefix + first + second)
    ),
  ];
}
