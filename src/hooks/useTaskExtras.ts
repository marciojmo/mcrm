import { useCallback, useEffect, useState } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { getTaskExtras } from '@/app/(app)/dashboard/taskActions';
import { useToast } from '@/components/ui/Toast';
import type { TaskExtras } from '@/types/task';

const RELOAD_ERROR_MESSAGE = 'Salvo, mas não foi possível atualizar a tela.';

export function useTaskExtras(taskId: string) {
  const toast = useToast();
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
    try {
      setExtras(await getTaskExtras(taskId));
    } catch (error) {
      unstable_rethrow(error);
      toast.add({ title: RELOAD_ERROR_MESSAGE, priority: 'high' });
    }
  }, [taskId, toast]);

  return { extras, reload };
}
