import { create } from "zustand";
import { Team } from "../../types/sportsTypes";

interface TeamSelectionState {
  homeTeam: Team | null;
  awayTeam: Team | null;
  setHomeTeam: (team: Team | null) => void;
  setAwayTeam: (team: Team | null) => void;
}

export const useTeamSelection = create<TeamSelectionState>((set) => ({
  homeTeam: null,
  awayTeam: null,
  setHomeTeam: (team) => set({ homeTeam: team }),
  setAwayTeam: (team) => set({ awayTeam: team }),
})); 