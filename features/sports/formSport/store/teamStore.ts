import { create } from "zustand";
import { Team } from "../../types/sportsTypes";

interface TeamSelectionState {
  teams: Team[];
  homeTeam: Team | null;
  awayTeam: Team | null;
  setHomeTeam: (team: Team | null) => void;
  setAwayTeam: (team: Team | null) => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  setTeams: (teams: Team[]) => void;
}

export const useTeamSelection = create<TeamSelectionState>((set) => ({
  teams: [],
  homeTeam: null,
  awayTeam: null,
  selectedTeam: null,
  setHomeTeam: (team) => set({ homeTeam: team }),
  setAwayTeam: (team) => set({ awayTeam: team }),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setTeams: (teams) => set({ teams }),
}));
