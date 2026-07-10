'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockEvents } from '@/data/mock';

interface EventsContextValue {
  isRegistered: (id: string) => boolean;
  register: (id: string) => void;
  cancelRegistration: (id: string) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockEvents.map((e) => [e.id, !!e.isRegistered]))
  );

  function isRegistered(id: string) {
    return !!registeredIds[id];
  }

  function register(id: string) {
    setRegisteredIds((prev) => ({ ...prev, [id]: true }));
  }

  function cancelRegistration(id: string) {
    setRegisteredIds((prev) => ({ ...prev, [id]: false }));
  }

  return (
    <EventsContext.Provider value={{ isRegistered, register, cancelRegistration }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used inside EventsProvider');
  return ctx;
}
