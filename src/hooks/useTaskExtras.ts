import { useCallback, useEffect, useState } from 'react';
import { getTaskExtras } from '@/app/(app)/dashboard/taskActions';
import type { TaskExtras } from '@/types/task';

export function useTaskExtras(taskId: string) {
  const [extras, setExtras] = useState<TaskExtras | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getTaskExtras(taskId).then((loaded) => {
      if (isCurrent) setExtras(loaded);
    });
    return () => {
      isCurrent = false;
    };
  }, [taskId]);

  const reload = useCallback(async () => {
    setExtras(await getTaskExtras(taskId));
  }, [taskId]);

  return { extras, reload };
}
