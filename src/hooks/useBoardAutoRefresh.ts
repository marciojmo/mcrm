import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDndMonitor } from '@dnd-kit/core';
import { hasPendingActions } from '@/hooks/useSafeTransition';

const REFRESH_INTERVAL_MS = 10_000;
const OPEN_OVERLAY_SELECTOR =
  '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]';
const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

function isEditing() {
  return (
    document.querySelector(OPEN_OVERLAY_SELECTOR) !== null ||
    document.activeElement?.matches(EDITABLE_SELECTOR) === true
  );
}

export function useBoardAutoRefresh() {
  const router = useRouter();
  const isDragging = useRef(false);
  useDndMonitor({
    onDragStart: () => {
      isDragging.current = true;
    },
    onDragEnd: () => {
      isDragging.current = false;
    },
    onDragCancel: () => {
      isDragging.current = false;
    },
  });

  useEffect(() => {
    function refresh() {
      if (document.hidden || isDragging.current) return;
      if (hasPendingActions() || isEditing()) return;
      router.refresh();
    }
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router]);
}
