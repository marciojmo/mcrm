'use client';

import { createContext, useContext } from 'react';

const AppTimeZoneContext = createContext<string | null>(null);

interface AppTimeZoneProviderProps {
  timeZone: string;
  children: React.ReactNode;
}

export function AppTimeZoneProvider({
  timeZone,
  children,
}: AppTimeZoneProviderProps) {
  return (
    <AppTimeZoneContext.Provider value={timeZone}>
      {children}
    </AppTimeZoneContext.Provider>
  );
}

export function useAppTimeZone() {
  const timeZone = useContext(AppTimeZoneContext);
  if (!timeZone) throw new Error('Missing AppTimeZoneProvider');
  return timeZone;
}
