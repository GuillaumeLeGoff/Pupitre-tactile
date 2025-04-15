import { create } from "zustand";
import {
  Sport,
  SportConfig,
  SportsState,
  Match,
  Player,
} from "../types/sportsTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

const initialSports = [
  {
    id: "basketball",
    name: "Basketball",
    icon: "BasketballIcon",
    matches: [],
    players: [],
    config: {
      preMatchTimer: "00:00",
      overtimeTimer: "05:00",
      periods: {
        count: 4,
        duration: "10:00",
      },
      breakTimes: {
        main: "15:00",
        secondary: "02:00",
        beforeOvertime: "01:00",
      },
      chronos: {
        enabled: true,
        countdown: true,
        durations: ["24", "14"] as [string, string],
      },
      timeouts: {
        count: 3,
      },
      display: {
        showRedSquare: true,
      },
    },
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "BadmintonIcon",
    matches: [],
    players: [],
  },
  { id: "boxe", name: "Boxe", icon: "BoxeIcon", matches: [], players: [] },
  {
    id: "field-hockey",
    name: "Field Hockey",
    icon: "FieldHockeyIcon",
    matches: [],
    players: [],
  },
  {
    id: "futbal",
    name: "Futbal",
    icon: "FutbalIcon",
    matches: [],
    players: [],
  },
  {
    id: "floorball",
    name: "Floorball",
    icon: "FloorballIcon",
    matches: [],
    players: [],
  },
  { id: "foot", name: "Foot", icon: "FootIcon", matches: [], players: [] },
  {
    id: "netball",
    name: "Netball",
    icon: "NetballIcon",
    matches: [],
    players: [],
  },
  {
    id: "volley",
    name: "Volley",
    icon: "VolleyIcon",
    matches: [],
    players: [],
  },
];

export const useSportsStore = create<SportsState>()(
  persist(
    (set) => ({
      sports: initialSports,
      selectedSport: null,
      loading: false,
      error: null,

      selectSport: (sport: Sport) => set({ selectedSport: sport }),
      clearSelection: () => set({ selectedSport: null }),
      updateSportConfig: (sportId: string, config: SportConfig) =>
        set((state) => ({
          sports: state.sports.map((sport) =>
            sport.id === sportId ? { ...sport, config } : sport
          ),
          selectedSport:
            state.selectedSport?.id === sportId
              ? { ...state.selectedSport, config }
              : state.selectedSport,
        })),

      // Gestion des matchs
      addMatch: (sportId: string, matchData: Omit<Match, "id">) =>
        set((state) => {
          const newMatch: Match = {
            ...matchData,
            id: Date.now().toString(), // générer un ID unique
          };

          const updatedSports = state.sports.map((sport) => {
            if (sport.id === sportId) {
              const matches = [...(sport.matches || []), newMatch];
              return { ...sport, matches };
            }
            return sport;
          });

          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? {
                  ...state.selectedSport,
                  matches: [...(state.selectedSport.matches || []), newMatch],
                }
              : state.selectedSport;

          return {
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),

      updateMatch: (sportId: string, updatedMatch: Match) =>
        set((state) => {
          const updatedSports = state.sports.map((sport) => {
            if (sport.id === sportId) {
              const matches = (sport.matches || []).map((match) =>
                match.id === updatedMatch.id ? updatedMatch : match
              );
              return { ...sport, matches };
            }
            return sport;
          });

          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? {
                  ...state.selectedSport,
                  matches: (state.selectedSport.matches || []).map((match) =>
                    match.id === updatedMatch.id ? updatedMatch : match
                  ),
                }
              : state.selectedSport;

          return {
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),

      deleteMatch: (sportId: string, matchId: string) =>
        set((state) => {
          const updatedSports = state.sports.map((sport) => {
            if (sport.id === sportId) {
              const matches = (sport.matches || []).filter(
                (match) => match.id !== matchId
              );
              return { ...sport, matches };
            }
            return sport;
          });

          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? {
                  ...state.selectedSport,
                  matches: (state.selectedSport.matches || []).filter(
                    (match) => match.id !== matchId
                  ),
                }
              : state.selectedSport;

          return {
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),

      // Gestion des joueurs
      addPlayer: (sportId: string, playerData: Omit<Player, "id">) =>
        set((state) => {
          const newPlayer: Player = {
            ...playerData,
            id: Date.now().toString(), // générer un ID unique
          };

          const updatedSports = state.sports.map((sport) => {
            if (sport.id === sportId) {
              const players = [...(sport.players || []), newPlayer];
              return { ...sport, players };
            }
            return sport;
          });

          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? {
                  ...state.selectedSport,
                  players: [...(state.selectedSport.players || []), newPlayer],
                }
              : state.selectedSport;

          return {
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),

      updatePlayer: (sportId: string, updatedPlayer: Player) =>
        set((state) => {
          const updatedSports = state.sports.map((sport) => {
            if (sport.id === sportId) {
              const players = (sport.players || []).map((player) =>
                player.id === updatedPlayer.id ? updatedPlayer : player
              );
              return { ...sport, players };
            }
            return sport;
          });

          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? {
                  ...state.selectedSport,
                  players: (state.selectedSport.players || []).map((player) =>
                    player.id === updatedPlayer.id ? updatedPlayer : player
                  ),
                }
              : state.selectedSport;

          return {
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),

      deletePlayer: (sportId: string, playerId: string) =>
        set((state) => {
          // Validation des paramètres
          if (!sportId || !playerId) {
            return state;
          }

          // 1. Vérifier si le sport existe
          const sport = state.sports.find((s) => s.id === sportId);
          if (!sport) {
            return state;
          }

          // 2. Vérifier si le joueur existe
          const sportPlayers = sport.players || [];
          const playerIndex = sportPlayers.findIndex((p) => p.id === playerId);

          if (playerIndex === -1) {
            return state;
          }

          // 3. Créer une copie du tableau de joueurs sans le joueur à supprimer
          const updatedPlayers = [...sportPlayers];
          updatedPlayers.splice(playerIndex, 1);

          // 4. Mettre à jour le sport avec le nouveau tableau de joueurs
          const updatedSport = {
            ...sport,
            players: updatedPlayers,
          };

          // 5. Mettre à jour la liste des sports
          const updatedSports = state.sports.map((s) =>
            s.id === sportId ? updatedSport : s
          );

          // 6. Mettre à jour le sport sélectionné si nécessaire
          const updatedSelectedSport =
            state.selectedSport?.id === sportId
              ? updatedSport
              : state.selectedSport;

          return {
            ...state,
            sports: updatedSports,
            selectedSport: updatedSelectedSport,
          };
        }),
    }),
    {
      name: "sports-storage", // nom unique pour le stockage
      storage: createJSONStorage(() => AsyncStorage), // utilisation d'AsyncStorage
    }
  )
);
