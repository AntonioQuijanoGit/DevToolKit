import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentToolsStore {
  recent: string[];
  addRecent: (toolId: string) => void;
  clearRecent: () => void;
  getRecent: (limit?: number) => string[];
}

export const useRecentToolsStore = create<RecentToolsStore>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (toolId) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.recent.filter((id) => id !== toolId);
          // Add to beginning
          return { recent: [toolId, ...filtered].slice(0, 10) }; // Keep last 10
        });
      },
      clearRecent: () => set({ recent: [] }),
      getRecent: (limit = 10) => {
        const state = get();
        return state.recent.slice(0, limit);
      },
    }),
    {
      name: "devtoolkit-recent-tools",
    }
  )
);

