'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';

const TOAST_DURATION_MS = 3000;

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed right-0 bottom-4 left-0 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            toast={toast}
            className="rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-md transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
          >
            <ToastPrimitive.Title />
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider timeout={TOAST_DURATION_MS}>
      {children}
      <ToastList />
    </ToastPrimitive.Provider>
  );
}

const useToast = ToastPrimitive.useToastManager;

export { ToastProvider, useToast };
