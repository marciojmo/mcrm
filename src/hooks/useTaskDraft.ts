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
  const failedCloseKey = useRef<string>(null);
  const isDiscarded = useRef(false);
  const toast = useToast();
  const { isPending, runAction } = useSafeTransition();

  function getDraft(changes: Partial<TaskDetails>) {
    const merged = { ...details, ...changes };
    const next = merged.title.trim()
      ? merged
      : { ...merged, title: savedDetails.current.title };
    const normalized = normalizeDetails(next);
    return { next, normalized, key: JSON.stringify(normalized) };
  }

  function save(changes: Partial<TaskDetails>) {
    const { next, normalized, key } = getDraft(changes);
    setDetails(next);
    if (pendingSave.current?.key === key) return pendingSave.current.isSaved;
    if (key === JSON.stringify(savedDetails.current))
      return Promise.resolve(true);
    const isSaved = runAction(() => updateTask(task.id, next), {
      errorMessage: null,
    }).then((isOk) => {
      if (isOk) {
        savedDetails.current = normalized;
        failedCloseKey.current = null;
      }
      if (pendingSave.current?.isSaved === isSaved) pendingSave.current = null;
      return isOk;
    });
    pendingSave.current = { key, isSaved };
    return isSaved;
  }

  async function saveField(changes: Partial<TaskDetails> = {}) {
    const isSaved = await save(changes);
    if (!isSaved && !isClosing.current && !isDiscarded.current)
      toast.add({ title: SAVE_ERROR_MESSAGE, priority: 'high' });
  }

  async function close(proceed: () => void = onClose) {
    if (isClosing.current) return;
    const { key } = getDraft({});
    if (key === failedCloseKey.current) {
      isDiscarded.current = true;
      return proceed();
    }
    isClosing.current = true;
    const isSaved = await save({});
    isClosing.current = false;
    if (isSaved) return proceed();
    failedCloseKey.current = key;
    toast.add({ title: DISCARD_WARNING, priority: 'high' });
  }

  return { details, setDetails, isPending, runAction, saveField, close };
}
