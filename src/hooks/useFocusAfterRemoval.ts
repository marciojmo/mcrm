import { useEffect, useRef } from 'react';

export function useFocusAfterRemoval(
  count: number,
  getTarget: () => HTMLElement | null | undefined
) {
  const previousCount = useRef(count);
  useEffect(() => {
    if (
      count < previousCount.current &&
      document.activeElement === document.body
    )
      getTarget()?.focus();
    previousCount.current = count;
  });
}
