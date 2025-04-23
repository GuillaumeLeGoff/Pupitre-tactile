import { create } from "zustand";
import { Sport } from "../../types/sportsTypes";

interface SportSelectedState {
  sport: Sport | null;
  setSport: (sport: Sport) => void;
}

export const useSportSelected = create<SportSelectedState>((set) => ({
  sport: null,
  setSport: (sport: Sport) => set({ sport }),
}));

