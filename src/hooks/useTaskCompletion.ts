import { useOptimistic } from 'react';
import { setTaskCompleted } from '@/app/(app)/dashboard/actions';
import { useSafeTransition } from '@/hooks/useSafeTransition';

export function useTaskCompletion(taskId: string, isCompleted: boolean) {
  const [isOptimisticallyCompleted, setIsOptimisticallyCompleted] =
    useOptimistic(isCompleted);
  const { runAction } = useSafeTransition();

  function toggle() {
    runAction(async () => {
      const isNowCompleted = !isOptimisticallyCompleted;
      setIsOptimisticallyCompleted(isNowCompleted);
      await setTaskCompleted(taskId, isNowCompleted);
    });
  }

  return { isCompleted: isOptimisticallyCompleted, toggle };
}
