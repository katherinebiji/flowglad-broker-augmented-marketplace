'use client';

import { createContext, useContext } from 'react';
import { useHonchoManager } from '@/hooks/useHonchoManager'; // your existing hook

const HonchoContext = createContext<ReturnType<typeof useHonchoManager> | null>(null);

export function HonchoProvider({ children }: { children: React.ReactNode }) {
  const honcho = useHonchoManager();
  return (
    <HonchoContext.Provider value={honcho}>
      {children}
    </HonchoContext.Provider>
  );
}

export function useHoncho() {
  const context = useContext(HonchoContext);
  if (!context) {
    throw new Error('useHoncho must be used within a HonchoProvider');
  }
  return context;
}