import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sport } from "../../types/sportsTypes";

interface SportSelectedState {
  sport: Sport | null;
  setSport: (sport: Sport) => void;
  clearSport: () => void;
}

export const useSportSelected = create<SportSelectedState>()(
  persist(
    (set) => ({
      sport: null,
      setSport: (sport: Sport) => set({ sport }),
      clearSport: () => set({ sport: null }),
    }),
    {
      name: "selected-sport",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
