import { useTransition } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export const SAVE_ERROR_MESSAGE = 'Não foi possível salvar. Tente novamente.';

interface ActionOptions {
  onError?: () => void;
  errorMessage?: string | null;
}

export function useSafeTransition() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  function runAction(
    action: () => Promise<unknown>,
    { onError, errorMessage = SAVE_ERROR_MESSAGE }: ActionOptions = {}
  ) {
    return new Promise<boolean>((resolve) =>
      startTransition(async () => {
        try {
          await action();
          resolve(true);
        } catch (error) {
          unstable_rethrow(error);
          onError?.();
          if (errorMessage)
            toast.add({ title: errorMessage, priority: 'high' });
          resolve(false);
        }
      })
    );
  }

  return { isPending, runAction };
}
