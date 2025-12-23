import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (toolId) => {
        set((state) => {
          const isFav = state.favorites.includes(toolId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== toolId)
              : [...state.favorites, toolId],
          };
        });
      },
      isFavorite: (toolId) => {
        return get().favorites.includes(toolId);
      },
    }),
    {
      name: "devtoolkit-favorites",
    }
  )
);

