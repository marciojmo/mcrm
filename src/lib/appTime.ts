export function getToday(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function formatDateTime(date: Date | string, timeZone: string) {
  return new Date(date).toLocaleString('pt-BR', { timeZone });
}
