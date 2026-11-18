import { useTransition } from 'react';
import { unstable_rethrow, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

const SAVE_ERROR_MESSAGE = 'Não foi possível salvar. Tente novamente.';

export function useSafeTransition() {
  const router = useRouter();
  const toast = useToast();
  const [, startTransition] = useTransition();

  function runAction(action: () => Promise<unknown>, onError?: () => void) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        unstable_rethrow(error);
        onError?.();
        toast.add({ title: SAVE_ERROR_MESSAGE });
        router.refresh();
      }
    });
  }

  return runAction;
}
