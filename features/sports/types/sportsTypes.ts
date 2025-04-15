export interface Sport {
  id: string;
  name: string;
  icon: string;
  config?: SportConfig;
  matches?: Match[];
  players?: Player[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
}

export interface Team {
  id: string;
  name: string;
  number: number;
}

export interface Match {
  id: string;
  name: string;
  date?: string;
  homeTeam: Team;
  awayTeam: Team;
}

export interface SportConfig {
  preMatchTimer?: string; // 00:00
  overtimeTimer?: string; // 00:00
  periods?: {
    count: number;
    duration: string; // 00:00
  };
  breakTimes?: {
    main: string; // 00:00
    secondary: string; // 00:00
    beforeOvertime: string; // 00:00
  };
  chronos?: {
    enabled: boolean;
    countdown: boolean; // true: décompte, false: compte normal
    durations: [string, string]; // durée en secondes des 2 chronos
  };
  timeouts?: {
    count: number; // nombre de temps morts
  };
  display?: {
    showRedSquare: boolean;
  };
}

export interface BasketballConfig extends SportConfig {
  // Paramètres spécifiques au basketball si nécessaire
}

export type SportsState = {
  sports: Sport[];
  selectedSport: Sport | null;
  loading: boolean;
  error: string | null;

  selectSport: (sport: Sport) => void;
  clearSelection: () => void;
  updateSportConfig: (sportId: string, config: SportConfig) => void;
  addMatch: (sportId: string, match: Omit<Match, "id">) => void;
  updateMatch: (sportId: string, match: Match) => void;
  deleteMatch: (sportId: string, matchId: string) => void;

  // Gestion des joueurs
  addPlayer: (sportId: string, player: Omit<Player, "id">) => void;
  updatePlayer: (sportId: string, player: Player) => void;
  deletePlayer: (sportId: string, playerId: string) => void;
};
