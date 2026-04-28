import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TableSession } from '../types';

interface SessionState extends Partial<TableSession> {
  setSession: (session: TableSession) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      tableId: undefined,
      sessionId: undefined,
      restaurantId: undefined,
      guestToken: undefined,
      setSession: (session) => set(session),
      clearSession: () => set({
        tableId: undefined,
        sessionId: undefined,
        restaurantId: undefined,
        guestToken: undefined,
      }),
    }),
    {
      name: 'session-storage',
    }
  )
);
