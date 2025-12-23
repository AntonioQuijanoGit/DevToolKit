import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HistoryItem {
  id: string;
  tool: string;
  timestamp: number;
  input: string;
  output: string;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  clearHistory: (tool?: string) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => {
          // Keep only last 50 items per tool
          const toolHistory = state.history.filter((h) => h.tool === item.tool);
          const otherHistory = state.history.filter((h) => h.tool !== item.tool);
          const updatedToolHistory = [...toolHistory, newItem]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 50);
          return {
            history: [...otherHistory, ...updatedToolHistory],
          };
        });
      },
      clearHistory: (tool) => {
        if (tool) {
          set((state) => ({
            history: state.history.filter((h) => h.tool !== tool),
          }));
        } else {
          set({ history: [] });
        }
      },
    }),
    {
      name: "devtoolkit-history",
    }
  )
);

