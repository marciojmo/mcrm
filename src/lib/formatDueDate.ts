import { getToday } from '@/lib/appTime';

export function formatDueDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

export function isOverdue(isoDate: string, timeZone: string) {
  return isoDate < getToday(timeZone);
}
