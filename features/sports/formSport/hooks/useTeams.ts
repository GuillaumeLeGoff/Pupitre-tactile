import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Team, Sport, Player } from "../../types/sportsTypes";
import { Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTeamSelection } from "../store/teamStore";

// Clé pour stocker les équipes dans AsyncStorage
const TEAMS_STORAGE_KEY = "sports_teams";

// Interface pour stocker les équipes par sport
interface TeamsBySport {
  [sportId: string]: Team[];
}

interface UseTeamsReturn {
  teams: Team[];
  isLoading: boolean;
  loadTeams: () => Promise<void>;
  saveTeams: (updatedTeams: Team[]) => Promise<void>;
  addNewTeam: (sport: Sport | null) => Promise<Team | null>;
  handleTeamSelect: (value: any, isHomeTeam: boolean) => Promise<void>;
  openTeamManagement: (teamId: string) => void;
  deleteTeam: (teamId: string) => Promise<void>;
  // Nouvelles fonctions
  getTeamById: (teamId: string) => Team | undefined;
  updateTeamName: (newName: string) => Promise<void>;
  addPlayer: (playerName: string, playerNumber: string) => Promise<void>;
  removePlayer: (teamId: string, playerId: string) => Promise<void>;
  confirmDeleteTeam: (teamId: string) => Promise<void>;
}

export function useTeams(sport: Sport | null): UseTeamsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {
    homeTeam,
    awayTeam,
    setHomeTeam,
    setAwayTeam,
    selectedTeam,
    setSelectedTeam,
    teams,
    setTeams,
  } = useTeamSelection();

  // Désélectionner les équipes lorsque le sport change
  useEffect(() => {
    if (sport) {
      // Vérifier si les équipes sélectionnées appartiennent au sport actuel
      if (homeTeam && homeTeam.sportId !== sport.id) {
        setHomeTeam(null);
      }
      if (awayTeam && awayTeam.sportId !== sport.id) {
        setAwayTeam(null);
      }
      if (selectedTeam && selectedTeam.sportId !== sport.id) {
        setSelectedTeam(null);
      }
    } else {
      // Si aucun sport n'est sélectionné, désélectionner toutes les équipes
      setHomeTeam(null);
      setAwayTeam(null);
      setSelectedTeam(null);
    }
  }, [
    sport,
    homeTeam,
    awayTeam,
    selectedTeam,
    setHomeTeam,
    setAwayTeam,
    setSelectedTeam,
  ]);

  // Charger les équipes depuis AsyncStorage
  const loadTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedTeamsJson = await AsyncStorage.getItem(TEAMS_STORAGE_KEY);

      if (storedTeamsJson) {
        const allTeams: TeamsBySport = JSON.parse(storedTeamsJson);
        // Filtrer les équipes par sport
        const sportTeams = allTeams[sport?.id || ""] || [];
        setTeams(sportTeams);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error);
      Alert.alert("Erreur", "Impossible de charger les équipes");
    } finally {
      setIsLoading(false);
    }
  }, [sport?.id, setTeams]);

  // Sauvegarder les équipes dans AsyncStorage
  const saveTeams = useCallback(
    async (updatedTeams: Team[]) => {
      try {
        const storedTeamsJson = await AsyncStorage.getItem(TEAMS_STORAGE_KEY);
        let allTeams: TeamsBySport = {};

        if (storedTeamsJson) {
          allTeams = JSON.parse(storedTeamsJson);
        }

        // Mettre à jour les équipes pour le sport actuel
        allTeams[sport?.id || ""] = updatedTeams;

        await AsyncStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(allTeams));
        setTeams(updatedTeams);

        // Mettre à jour l'équipe sélectionnée si elle a été modifiée
        if (selectedTeam) {
          const updatedSelectedTeam = updatedTeams.find(
            (team) => team.id === selectedTeam.id
          );
          if (
            updatedSelectedTeam &&
            JSON.stringify(updatedSelectedTeam) !== JSON.stringify(selectedTeam)
          ) {
            setSelectedTeam(updatedSelectedTeam);
          }
        }

        // Mettre à jour les équipes domicile et extérieur si elles ont été modifiées
        if (homeTeam) {
          const updatedHomeTeam = updatedTeams.find(
            (team) => team.id === homeTeam.id
          );
          if (
            updatedHomeTeam &&
            JSON.stringify(updatedHomeTeam) !== JSON.stringify(homeTeam)
          ) {
            setHomeTeam(updatedHomeTeam);
          }
        }

        if (awayTeam) {
          const updatedAwayTeam = updatedTeams.find(
            (team) => team.id === awayTeam.id
          );
          if (
            updatedAwayTeam &&
            JSON.stringify(updatedAwayTeam) !== JSON.stringify(awayTeam)
          ) {
            setAwayTeam(updatedAwayTeam);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des équipes:", error);
        Alert.alert("Erreur", "Impossible de sauvegarder les équipes");
      }
    },
    [
      sport?.id,
      selectedTeam,
      homeTeam,
      awayTeam,
      setSelectedTeam,
      setHomeTeam,
      setAwayTeam,
      setTeams,
    ]
  );

  // Ajouter une nouvelle équipe
  const addNewTeam = useCallback(
    async (sport: Sport | null): Promise<Team | null> => {
      if (!sport) return null;

      const newTeamName = `Nouvelle équipe ${teams.length + 1}`;
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: newTeamName,
        number: teams.length + 1,
        sportId: sport.id,
        players: [],
      };

      const updatedTeams = [...teams, newTeam];
      await saveTeams(updatedTeams);

      // Définir automatiquement la nouvelle équipe comme équipe sélectionnée
      setSelectedTeam(newTeam);

      return newTeam;
    },
    [teams, saveTeams, setSelectedTeam]
  );

  // Supprimer une équipe
  const deleteTeam = useCallback(
    async (teamId: string) => {
      try {
        // Filtrer l'équipe à supprimer
        const updatedTeams = teams.filter((team) => team.id !== teamId);

        // Sauvegarder les équipes mises à jour
        await saveTeams(updatedTeams);

        // Désélectionner l'équipe si elle était sélectionnée
        if (homeTeam && homeTeam.id === teamId) {
          setHomeTeam(null);
        }
        if (awayTeam && awayTeam.id === teamId) {
          setAwayTeam(null);
        }
        if (selectedTeam && selectedTeam.id === teamId) {
          setSelectedTeam(null);
        }

        // Retourner à la page précédente
        router.back();

        Alert.alert("Succès", "L'équipe a été supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe:", error);
        Alert.alert("Erreur", "Impossible de supprimer l'équipe");
      }
    },
    [
      teams,
      saveTeams,
      homeTeam,
      awayTeam,
      selectedTeam,
      setHomeTeam,
      setAwayTeam,
      setSelectedTeam,
      router,
    ]
  );

  // Ouvrir la page de gestion d'une équipe existante
  const openTeamManagement = useCallback(
    (teamId: string) => {
      // Définir l'équipe sélectionnée avant de naviguer
      const team = teams.find((t) => t.id === teamId);
      if (team) {
        setSelectedTeam(team);
        // Mettre à jour l'équipe dans le store si c'est l'équipe domicile ou extérieur
        if (homeTeam?.id === teamId) {
          setHomeTeam(team);
        } else if (awayTeam?.id === teamId) {
          setAwayTeam(team);
        }
      }

      router.push(`/team/${teamId}`);
    },
    [router, teams, setSelectedTeam, homeTeam, awayTeam, setHomeTeam, setAwayTeam]
  );

  // Gérer la sélection d'une équipe
  const handleTeamSelect = useCallback(
    async (value: any, isHomeTeam: boolean) => {
      if (value === "add") {
        const newTeam = await addNewTeam(sport);
        if (newTeam) {
          // Mettre à jour l'équipe sélectionnée
          setSelectedTeam(newTeam);
          // Mettre à jour l'équipe domicile ou extérieur selon le cas
          if (isHomeTeam) {
            setHomeTeam(newTeam);
          } else {
            setAwayTeam(newTeam);
          }
          router.push(`/team/${newTeam.id}`);
        }
      } else {
        const selectedTeam = teams.find((team) => team.id === value);
        if (selectedTeam) {
          if (isHomeTeam) {
            setHomeTeam(selectedTeam);
          } else {
            setAwayTeam(selectedTeam);
          }
        }
      }
    },
    [teams, sport, addNewTeam, router, setHomeTeam, setAwayTeam, setSelectedTeam]
  );

  // Récupérer une équipe par son ID
  const getTeamById = useCallback(
    (teamId: string): Team | undefined => {
      // Vérifier d'abord si c'est l'équipe actuellement sélectionnée
      if (selectedTeam && selectedTeam.id === teamId) {
        return selectedTeam;
      }

      // Sinon chercher dans la liste des équipes
      const team = teams.find((team) => team.id === teamId);

      // Si on trouve l'équipe, la définir comme équipe sélectionnée
      if (team) {
        setSelectedTeam(team);
      }

      return team;
    },
    [teams, selectedTeam, setSelectedTeam]
  );

  // Mettre à jour le nom d'une équipe
  const updateTeamName = useCallback(
    async (newName: string) => {
      try {
        if (!selectedTeam) {
          Alert.alert("Erreur", "Aucune équipe sélectionnée");
          return;
        }

        const updatedTeams = teams.map((team) => {
          if (team.id === selectedTeam.id) {
            return { ...team, name: newName };
          }
          return team;
        });

        await saveTeams(updatedTeams);
        setTeams(updatedTeams);
        // L'assertion "as Team" indique à TypeScript que l'objet sera une Team valide
        setSelectedTeam({ ...selectedTeam, name: newName } as Team);

        Alert.alert("Succès", "Le nom de l'équipe a été mis à jour");
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom de l'équipe:",
          error
        );
        Alert.alert("Erreur", "Impossible de mettre à jour le nom de l'équipe");
      }
    },
    [teams, saveTeams, selectedTeam, setSelectedTeam]
  );

  // Ajouter un joueur à une équipe
  const addPlayer = useCallback(
    async (playerName: string, playerNumber: string) => {
      try {
        if (!playerName.trim()) {
          Alert.alert("Erreur", "Le nom du joueur ne peut pas être vide");
          return;
        }

        const playerNumberInt = parseInt(playerNumber, 10);
        if (isNaN(playerNumberInt) || playerNumberInt <= 0) {
          Alert.alert(
            "Erreur",
            "Le numéro du joueur doit être un nombre positif"
          );
          return;
        }

        // Vérifier si le numéro est déjà utilisé dans l'équipe
        if (selectedTeam?.players?.some((p) => p.number === playerNumberInt)) {
          Alert.alert(
            "Erreur",
            "Ce numéro est déjà utilisé par un autre joueur"
          );
          return;
        }

        const newPlayer: Player = {
          id: `player_${Date.now()}`,
          name: playerName,
          number: playerNumberInt,
        };

        const updatedTeams = teams.map((team) => {
          if (team.id === selectedTeam?.id) {
            const updatedTeam = {
              ...team,
              players: [...(team.players || []), newPlayer],
            };

            // Mettre à jour l'équipe sélectionnée si c'est celle qui a été modifiée
            if (selectedTeam && selectedTeam.id === team.id) {
              setSelectedTeam(updatedTeam);
            }

            return updatedTeam;
          }
          return team;
        });

        await saveTeams(updatedTeams);
        Alert.alert("Succès", "Le joueur a été ajouté à l'équipe");
      } catch (error) {
        console.error("Erreur lors de l'ajout du joueur:", error);
        Alert.alert("Erreur", "Impossible d'ajouter le joueur");
      }
    },
    [teams, saveTeams, selectedTeam, setSelectedTeam]
  );

  // Supprimer un joueur d'une équipe
  const removePlayer = useCallback(
    async (teamId: string, playerId: string) => {
      try {
        const updatedTeams = teams.map((team) => {
          if (team.id === teamId) {
            const updatedTeam = {
              ...team,
              players:
                team.players?.filter((player) => player.id !== playerId) || [],
            };

            // Mettre à jour l'équipe sélectionnée si c'est celle qui a été modifiée
            if (selectedTeam && selectedTeam.id === teamId) {
              setSelectedTeam(updatedTeam);
            }

            return updatedTeam;
          }
          return team;
        });

        await saveTeams(updatedTeams);
        Alert.alert("Succès", "Le joueur a été supprimé de l'équipe");
      } catch (error) {
        console.error("Erreur lors de la suppression du joueur:", error);
        Alert.alert("Erreur", "Impossible de supprimer le joueur");
      }
    },
    [teams, saveTeams, selectedTeam, setSelectedTeam]
  );

  // Confirmer la suppression d'une équipe
  const confirmDeleteTeam = useCallback(
    async (teamId: string, isHomeTeam: boolean): Promise<void> => {
      try {
        await deleteTeam(teamId);
        if (isHomeTeam) {
          setHomeTeam(null);
        } else {
          setAwayTeam(null);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe:", error);
        Alert.alert("Erreur", "Impossible de supprimer l'équipe");
      }
    },
    [deleteTeam, setHomeTeam, setAwayTeam]
  );

  // Charger les équipes au montage et quand le sport change
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return {
    teams,
    isLoading,
    loadTeams,
    saveTeams,
    addNewTeam,
    handleTeamSelect,
    openTeamManagement,
    deleteTeam,
    // Nouvelles fonctions
    getTeamById,
    updateTeamName,
    addPlayer,
    removePlayer,
    confirmDeleteTeam,
  };
}
