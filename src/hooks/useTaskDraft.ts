import { useRef, useState } from 'react';
import { updateTask } from '@/app/(app)/dashboard/actions';
import { useToast } from '@/components/ui/Toast';
import {
  SAVE_ERROR_MESSAGE,
  useSafeTransition,
} from '@/hooks/useSafeTransition';
import type { BoardTask, TaskDetails } from '@/types/board';

const DISCARD_WARNING =
  'Não foi possível salvar. Feche de novo para descartar as alterações.';

function normalizeDetails({ title, description, dueDate }: TaskDetails) {
  return {
    title: title.trim(),
    description: description?.trim() || null,
    dueDate,
  };
}

export function useTaskDraft(task: BoardTask, onClose: () => void) {
  const [details, setDetails] = useState(() => normalizeDetails(task));
  const savedDetails = useRef(details);
  const pendingSave = useRef<{ key: string; isSaved: Promise<boolean> }>(null);
  const isClosing = useRef(false);
  const hasFailedToClose = useRef(false);
  const toast = useToast();
  const { isPending, runAction } = useSafeTransition();

  function save(changes: Partial<TaskDetails>) {
    const merged = { ...details, ...changes };
    const next = merged.title.trim()
      ? merged
      : { ...merged, title: savedDetails.current.title };
    setDetails(next);
    const normalized = normalizeDetails(next);
    const key = JSON.stringify(normalized);
    if (pendingSave.current?.key === key) return pendingSave.current.isSaved;
    if (key === JSON.stringify(savedDetails.current))
      return Promise.resolve(true);
    const isSaved = runAction(() => updateTask(task.id, next), {
      errorMessage: null,
    }).then((isOk) => {
      if (isOk) savedDetails.current = normalized;
      if (pendingSave.current?.isSaved === isSaved) pendingSave.current = null;
      return isOk;
    });
    pendingSave.current = { key, isSaved };
    return isSaved;
  }

  async function saveField(changes: Partial<TaskDetails> = {}) {
    const isSaved = await save(changes);
    if (!isSaved && !isClosing.current)
      toast.add({ title: SAVE_ERROR_MESSAGE, priority: 'high' });
  }

  async function close() {
    if (isClosing.current) return;
    if (hasFailedToClose.current) return onClose();
    isClosing.current = true;
    const isSaved = await save({});
    isClosing.current = false;
    if (isSaved) return onClose();
    hasFailedToClose.current = true;
    toast.add({ title: DISCARD_WARNING, priority: 'high' });
  }

  return { details, setDetails, isPending, runAction, saveField, close };
}
