'use client';

import { useBoardAutoRefresh } from '@/hooks/useBoardAutoRefresh';

export function BoardAutoRefresh() {
  useBoardAutoRefresh();
  return null;
}
