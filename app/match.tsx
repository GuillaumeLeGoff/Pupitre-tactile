import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSportsStore } from "@/features/sports/store/sportsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MatchScreen() {
  const router = useRouter();
  const { sportId } = useLocalSearchParams<{ sportId: string }>();
  const { sports } = useSportsStore();
  const insets = useSafeAreaInsets();

  // Trouver le sport sélectionné
  const sport = sports.find((s) => s.id === sportId);

  // États pour le match
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(
    sport?.config?.periods?.duration
      ? convertTimeStringToSeconds(sport.config.periods.duration)
      : 600
  );
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeFouls, setHomeFouls] = useState(0);
  const [awayFouls, setAwayFouls] = useState(0);

  // État pour les fautes et points des joueurs
  const [playerFouls, setPlayerFouls] = useState<Record<string, number>>({});
  const [playerPoints, setPlayerPoints] = useState<Record<string, number>>({});

  // Référence pour l'intervalle du timer
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Filtrer les joueurs par équipe
  const homeTeamPlayers =
    sport?.players?.filter((player) => player.number % 2 === 0) || [];
  const awayTeamPlayers =
    sport?.players?.filter((player) => player.number % 2 === 1) || [];

  // Convertir une chaîne de temps (mm:ss) en secondes
  function convertTimeStringToSeconds(timeString: string): number {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + (seconds || 0);
  }

  // Convertir des secondes en format mm:ss
  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Démarrer/reprendre le timer
  const startTimer = () => {
    if (timerInterval.current) return;

    setIsPlaying(true);
    timerInterval.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Si le timer atteint zéro
          clearInterval(timerInterval.current!);
          timerInterval.current = null;
          setIsPlaying(false);

          if (currentPeriod < (sport?.config?.periods?.count || 4)) {
            Alert.alert(
              "Fin de période",
              `La période ${currentPeriod} est terminée.`
            );
            setCurrentPeriod((prev) => prev + 1);
            return convertTimeStringToSeconds(
              sport?.config?.periods?.duration || "10:00"
            );
          } else {
            Alert.alert("Fin du match", "Le match est terminé!");
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Mettre en pause le timer
  const pauseTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
      setIsPlaying(false);
    }
  };

  // Réinitialiser le timer
  const resetTimer = () => {
    pauseTimer();
    setTimerSeconds(
      convertTimeStringToSeconds(sport?.config?.periods?.duration || "10:00")
    );
  };

  // Nettoyer l'intervalle lors du démontage du composant
  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  // Fonctions pour mettre à jour le score
  const incrementHomeScore = (points: number) =>
    setHomeScore((prev) => prev + points);
  const incrementAwayScore = (points: number) =>
    setAwayScore((prev) => prev + points);
  const decrementHomeScore = (points: number) =>
    setHomeScore((prev) => Math.max(0, prev - points));
  const decrementAwayScore = (points: number) =>
    setAwayScore((prev) => Math.max(0, prev - points));

  // Fonctions pour gérer les fautes
  const incrementHomeFouls = () => setHomeFouls((prev) => prev + 1);
  const incrementAwayFouls = () => setAwayFouls((prev) => prev + 1);
  const decrementHomeFouls = () =>
    setHomeFouls((prev) => Math.max(0, prev - 1));
  const decrementAwayFouls = () =>
    setAwayFouls((prev) => Math.max(0, prev - 1));

  // Fonction pour incrémenter les fautes d'un joueur spécifique
  const incrementPlayerFoul = (playerId: string, isHome: boolean) => {
    setPlayerFouls((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));

    // Mettre à jour aussi le compteur global de l'équipe
    if (isHome) {
      incrementHomeFouls();
    } else {
      incrementAwayFouls();
    }
  };

  // Fonction pour décrémenter les fautes d'un joueur spécifique
  const decrementPlayerFoul = (playerId: string, isHome: boolean) => {
    setPlayerFouls((prev) => {
      const currentFouls = prev[playerId] || 0;
      if (currentFouls <= 0) return prev;

      return {
        ...prev,
        [playerId]: currentFouls - 1,
      };
    });

    // Mettre à jour aussi le compteur global de l'équipe
    if (isHome) {
      decrementHomeFouls();
    } else {
      decrementAwayFouls();
    }
  };

  // Fonction pour attribuer des points à un joueur spécifique
  const addPlayerPoints = (
    playerId: string,
    points: number,
    isHome: boolean
  ) => {
    setPlayerPoints((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + points,
    }));

    // Mettre à jour aussi le score global de l'équipe
    if (isHome) {
      incrementHomeScore(points);
    } else {
      incrementAwayScore(points);
    }
  };

  // Fonction pour retirer des points à un joueur spécifique
  const removePlayerPoints = (
    playerId: string,
    points: number,
    isHome: boolean
  ) => {
    setPlayerPoints((prev) => {
      const currentPoints = prev[playerId] || 0;
      if (currentPoints < points) return prev; // Ne pas descendre en dessous de 0

      return {
        ...prev,
        [playerId]: currentPoints - points,
      };
    });

    // Mettre à jour aussi le score global de l'équipe
    if (isHome) {
      decrementHomeScore(points);
    } else {
      decrementAwayScore(points);
    }
  };

  // Retourner à l'écran précédent
  const handleBack = () => {
    if (isPlaying) {
      Alert.alert(
        "Match en cours",
        "Voulez-vous vraiment quitter le match en cours ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Quitter",
            onPress: () => {
              try {
                router.push("/");
              } catch (error) {
                console.error("Erreur de navigation:", error);
                // Fallback si la redirection échoue
                router.replace("/");
              }
            },
          },
        ]
      );
    } else {
      try {
        router.push("/");
      } catch (error) {
        console.error("Erreur de navigation:", error);
        // Fallback si la redirection échoue
        router.replace("/");
      }
    }
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="p-4 flex-row justify-between items-center border-b border-border">
        <TouchableOpacity onPress={handleBack}>
          <Text className="text-primary font-medium">Retour</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">
          {sport?.name || "Match"}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Timer et contrôles */}
          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-foreground">
                Période {currentPeriod}
              </Text>
              <Text className="text-3xl font-bold text-primary">
                {formatTime(timerSeconds)}
              </Text>
            </View>

            <View className="flex-row justify-center space-x-4">
              {!isPlaying ? (
                <TouchableOpacity
                  className="bg-primary px-8 py-3 rounded-md"
                  onPress={startTimer}
                >
                  <Text className="text-primary-foreground font-bold text-base">
                    Démarrer
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="bg-destructive px-8 py-3 rounded-md"
                  onPress={pauseTimer}
                >
                  <Text className="text-destructive-foreground font-bold text-base">
                    Pause
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="bg-muted px-8 py-3 rounded-md"
                onPress={resetTimer}
              >
                <Text className="text-foreground font-bold text-base">
                  Réinitialiser
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nouvelle disposition: joueurs à gauche et à droite du score */}
          <View className="flex-row">
            {/* Joueurs équipe domicile - Colonne gauche */}
            <View className="flex-1 pr-2">
              <Text className="text-lg font-bold text-foreground mb-2 text-center">
                {homeTeamPlayers.length > 0
                  ? homeTeamPlayers[0].name
                  : "Domicile"}
              </Text>

              <ScrollView className="max-h-[500px]">
                {homeTeamPlayers.length > 0 ? (
                  homeTeamPlayers.map((player) => (
                    <View
                      key={player.id}
                      className="p-3 bg-card rounded-md mb-3 border border-border"
                    >
                      <View className="flex-row items-center mb-2">
                        <Text className="font-bold text-foreground bg-primary/10 rounded-full px-3 py-1 text-center min-w-[40px] flex-row justify-center items-center mr-2">
                          {player.number}
                        </Text>
                        <Text className="text-foreground flex-1 text-base">
                          {player.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-primary font-bold text-base">
                            {playerPoints[player.id] || 0}pts
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between mt-2 flex-wrap">
                        {/* Points */}
                        <View className="flex-row flex-wrap">
                          <View className="flex-row bg-primary/10 rounded-md overflow-hidden mr-2 mb-1">
                            <TouchableOpacity
                              className="px-3 py-1 border-r border-primary/20"
                              onPress={() =>
                                removePlayerPoints(player.id, 1, true)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                -1
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="px-3 py-1"
                              onPress={() =>
                                addPlayerPoints(player.id, 1, true)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                +1
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <View className="flex-row bg-primary/10 rounded-md overflow-hidden mr-2 mb-1">
                            <TouchableOpacity
                              className="px-3 py-1 border-r border-primary/20"
                              onPress={() =>
                                removePlayerPoints(player.id, 2, true)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                -2
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="px-3 py-1"
                              onPress={() =>
                                addPlayerPoints(player.id, 2, true)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                +2
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Fautes */}
                          <View className="flex-row items-center">
                            <Text className="text-destructive font-bold mr-1 text-sm">
                              {playerFouls[player.id] || 0}F
                            </Text>
                            <View className="flex-row bg-destructive/10 rounded-md overflow-hidden">
                              <TouchableOpacity
                                className="px-3 py-1 border-r border-destructive/20"
                                onPress={() =>
                                  decrementPlayerFoul(player.id, true)
                                }
                              >
                                <Text className="text-destructive text-sm font-bold">
                                  -
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="px-3 py-1"
                                onPress={() =>
                                  incrementPlayerFoul(player.id, true)
                                }
                              >
                                <Text className="text-destructive text-sm font-bold">
                                  +
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="p-4 bg-muted rounded-md">
                    <Text className="text-center text-muted-foreground">
                      Aucun joueur
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Score et fautes - Colonne centrale */}
            <View className="flex-1 px-2">
              {/* Score */}
              <View className="bg-card rounded-lg p-4 mb-4">
                <Text className="text-lg font-bold text-foreground mb-4 text-center">
                  Score
                </Text>

                <View className="flex-row justify-center items-center mb-6">
                  <View className="flex-1 items-center">
                    <Text className="text-center text-8xl font-bold text-primary">
                      {homeScore}
                    </Text>
                  </View>

                  <Text className="text-4xl font-bold text-foreground mx-2">
                    -
                  </Text>

                  <View className="flex-1 items-center">
                    <Text className="text-center text-8xl font-bold text-primary">
                      {awayScore}
                    </Text>
                  </View>
                </View>

                {/* Fautes */}
                <Text className="text-lg font-bold text-foreground mb-4 text-center">
                  Fautes d'équipe
                </Text>

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 items-center">
                    <Text className="text-center text-4xl font-bold text-destructive">
                      {homeFouls}
                    </Text>
                  </View>

                  <Text className="text-2xl font-bold text-foreground mx-2">
                    -
                  </Text>

                  <View className="flex-1 items-center">
                    <Text className="text-center text-4xl font-bold text-destructive">
                      {awayFouls}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Joueurs équipe visiteur - Colonne droite */}
            <View className="flex-1 pl-2">
              <Text className="text-lg font-bold text-foreground mb-2 text-center">
                {awayTeamPlayers.length > 0
                  ? awayTeamPlayers[0].name
                  : "Visiteur"}
              </Text>

              <ScrollView className="max-h-[500px]">
                {awayTeamPlayers.length > 0 ? (
                  awayTeamPlayers.map((player) => (
                    <View
                      key={player.id}
                      className="p-3 bg-card rounded-md mb-3 border border-border"
                    >
                      <View className="flex-row items-center mb-2">
                        <Text className="font-bold text-foreground bg-primary/10 rounded-full px-3 py-1 text-center min-w-[40px] flex-row justify-center items-center mr-2">
                          {player.number}
                        </Text>
                        <Text className="text-foreground flex-1 text-base">
                          {player.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-primary font-bold text-base">
                            {playerPoints[player.id] || 0}pts
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between mt-2 flex-wrap">
                        {/* Points */}
                        <View className="flex-row flex-wrap">
                          <View className="flex-row bg-primary/10 rounded-md overflow-hidden mr-2 mb-1">
                            <TouchableOpacity
                              className="px-3 py-1 border-r border-primary/20"
                              onPress={() =>
                                removePlayerPoints(player.id, 1, false)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                -1
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="px-3 py-1"
                              onPress={() =>
                                addPlayerPoints(player.id, 1, false)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                +1
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <View className="flex-row bg-primary/10 rounded-md overflow-hidden mr-2 mb-1">
                            <TouchableOpacity
                              className="px-3 py-1 border-r border-primary/20"
                              onPress={() =>
                                removePlayerPoints(player.id, 2, false)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                -2
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="px-3 py-1"
                              onPress={() =>
                                addPlayerPoints(player.id, 2, false)
                              }
                            >
                              <Text className="text-primary text-sm font-bold">
                                +2
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Fautes */}
                          <View className="flex-row items-center">
                            <Text className="text-destructive font-bold mr-1 text-sm">
                              {playerFouls[player.id] || 0}F
                            </Text>
                            <View className="flex-row bg-destructive/10 rounded-md overflow-hidden">
                              <TouchableOpacity
                                className="px-3 py-1 border-r border-destructive/20"
                                onPress={() =>
                                  decrementPlayerFoul(player.id, false)
                                }
                              >
                                <Text className="text-destructive text-sm font-bold">
                                  -
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="px-3 py-1"
                                onPress={() =>
                                  incrementPlayerFoul(player.id, false)
                                }
                              >
                                <Text className="text-destructive text-sm font-bold">
                                  +
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="p-4 bg-muted rounded-md">
                    <Text className="text-center text-muted-foreground">
                      Aucun joueur
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
