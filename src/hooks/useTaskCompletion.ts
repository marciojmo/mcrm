import { startTransition, useOptimistic } from 'react';
import { setTaskCompleted } from '@/app/(app)/dashboard/actions';

export function useTaskCompletion(taskId: string, isCompleted: boolean) {
  const [isOptimisticallyCompleted, setIsOptimisticallyCompleted] =
    useOptimistic(isCompleted);

  function toggle() {
    startTransition(async () => {
      const isNowCompleted = !isOptimisticallyCompleted;
      setIsOptimisticallyCompleted(isNowCompleted);
      await setTaskCompleted(taskId, isNowCompleted);
    });
  }

  return { isCompleted: isOptimisticallyCompleted, toggle };
}
