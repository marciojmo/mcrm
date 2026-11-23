export function getToday(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function getOffset(instant: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
      .formatToParts(instant)
      .map((part) => [part.type, Number(part.value)])
  );
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return localAsUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

export function getStartOfDay(isoDate: string, timeZone: string) {
  const utcMidnight = new Date(`${isoDate}T00:00:00Z`).getTime();
  const guess = new Date(
    utcMidnight - getOffset(new Date(utcMidnight), timeZone)
  );
  return new Date(utcMidnight - getOffset(guess, timeZone));
}

export function formatDateTime(date: Date | string, timeZone: string) {
  return new Date(date).toLocaleString('pt-BR', { timeZone });
}
