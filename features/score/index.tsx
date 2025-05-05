import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Button } from "../../components/ui/button";
import { useRouter } from "expo-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { useTeamSelection } from "../sports/formSport/store/teamStore";
import { useSportSelected } from "../sports/selectSport/store/sportSelected";
import { useGameSettings } from "../sports/formSport/store/gameSettings";

// Interface pour le score des joueurs
interface PlayerScores {
  [playerId: string]: number;
}

// Interface pour les fautes des joueurs
interface PlayerFouls {
  [playerId: string]: number;
}

export default function Score() {
  const router = useRouter();
  const { homeTeam, awayTeam } = useTeamSelection();
  const { sport } = useSportSelected();
  const gameSettings = useGameSettings();

  // États pour les scores
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [playerScores, setPlayerScores] = useState<PlayerScores>({});

  // États pour les fautes
  const [homeFouls, setHomeFouls] = useState(0);
  const [awayFouls, setAwayFouls] = useState(0);
  const [playerFouls, setPlayerFouls] = useState<PlayerFouls>({});

  // États pour les temps morts
  const [homeTimeouts, setHomeTimeouts] = useState(3);
  const [awayTimeouts, setAwayTimeouts] = useState(3);

  // Initialisation des scores et des fautes des joueurs
  useEffect(() => {
    const newPlayerScores: PlayerScores = {};
    const newPlayerFouls: PlayerFouls = {};

    // Initialiser les scores et fautes des joueurs de l'équipe domicile
    homeTeam?.players?.forEach((player) => {
      newPlayerScores[player.id] = 0;
      newPlayerFouls[player.id] = 0;
    });

    // Initialiser les scores et fautes des joueurs de l'équipe extérieure
    awayTeam?.players?.forEach((player) => {
      newPlayerScores[player.id] = 0;
      newPlayerFouls[player.id] = 0;
    });

    setPlayerScores(newPlayerScores);
    setPlayerFouls(newPlayerFouls);
  }, [homeTeam, awayTeam]);

  // Fonctions pour incrémenter les scores
  const incrementHomeScore = () => setHomeScore((prev) => prev + 1);
  const incrementAwayScore = () => setAwayScore((prev) => prev + 1);

  // Fonction pour incrémenter la période
  const incrementPeriod = () => {
    // Limiter à 4 périodes + prolongations (5+)
    setCurrentPeriod((prev) => prev + 1);
  };

  // Fonctions pour incrémenter les fautes
  const incrementHomeFouls = () => setHomeFouls((prev) => prev + 1);
  const incrementAwayFouls = () => setAwayFouls((prev) => prev + 1);

  // Fonctions pour utiliser les temps morts
  const useHomeTimeout = () => {
    if (homeTimeouts > 0) {
      setHomeTimeouts((prev) => prev - 1);
    }
  };

  const useAwayTimeout = () => {
    if (awayTimeouts > 0) {
      setAwayTimeouts((prev) => prev - 1);
    }
  };

  // Fonction pour incrémenter le score d'un joueur
  const incrementPlayerScore = (playerId: string, isHomeTeam: boolean) => {
    // Incrémenter le score du joueur
    setPlayerScores((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));

    // Incrémenter également le score de l'équipe
    if (isHomeTeam) {
      incrementHomeScore();
    } else {
      incrementAwayScore();
    }
  };

  // Fonction pour incrémenter les fautes d'un joueur
  const incrementPlayerFouls = (playerId: string, isHomeTeam: boolean) => {
    // Incrémenter les fautes du joueur
    setPlayerFouls((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));

    // Incrémenter également les fautes de l'équipe
    if (isHomeTeam) {
      incrementHomeFouls();
    } else {
      incrementAwayFouls();
    }
  };

  // Fonction pour afficher un joueur avec son score et fautes
  const renderPlayer = (player: any, index: number, isHomeTeam: boolean) => (
    <TouchableOpacity
      key={player.id || index}
      style={styles.playerCard}
      onPress={() => incrementPlayerScore(player.id, isHomeTeam)}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerNumber}>#{player.number}</Text>
        <Text style={styles.playerName}>{player.name}</Text>
      </View>
      <View style={styles.playerStats}>
        <View style={styles.playerScoreContainer}>
          <Text style={styles.playerScore}>{playerScores[player.id] || 0}</Text>
          <Text style={styles.playerScoreAdd}>+</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.playerFoulContainer,
            playerFouls[player.id] >= 5 ? styles.playerFoulDanger : null,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            incrementPlayerFouls(player.id, isHomeTeam);
          }}
        >
          <Text style={styles.playerFoulText}>
            F: {playerFouls[player.id] || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Composant pour afficher les indicateurs de temps morts
  const TimeoutIndicator = ({
    remaining,
    total = 3,
  }: {
    remaining: number;
    total?: number;
  }) => {
    const indicators = [];

    for (let i = 0; i < total; i++) {
      // Du bas vers le haut, donc on vérifie si l'indice actuel est inférieur au nombre restant
      const isActive = i < remaining;
      indicators.push(
        <View
          key={i}
          style={[
            styles.timeoutIndicator,
            isActive
              ? styles.timeoutIndicatorActive
              : styles.timeoutIndicatorInactive,
          ]}
        />
      );
    }

    // Renverser le tableau pour que le premier élément soit en haut
    return (
      <View style={styles.timeoutIndicatorContainer}>
        {indicators.reverse()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Carte équipe domicile (gauche) */}
        <Card style={styles.teamCard}>
          <CardHeader>
            <CardTitle style={styles.teamName}>
              {homeTeam?.name || "Équipe Domicile"}
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.teamCardContent}>
            <ScrollView>
              {homeTeam?.players && homeTeam.players.length > 0 ? (
                <View style={styles.playersList}>
                  {homeTeam.players.map((player, index) =>
                    renderPlayer(player, index, true)
                  )}
                </View>
              ) : (
                <Text style={styles.noPlayers}>Aucun joueur</Text>
              )}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Zone centrale (scores et timer) */}
        <View style={styles.centerContent}>
          {/* Scores */}
          <View style={styles.scoreContainer}>
            {/* Score équipe domicile */}
            <Pressable onPress={incrementHomeScore} style={styles.scoreBox}>
              <Text style={styles.scoreText}>{homeScore}</Text>
              <Text style={styles.scoreAddIndicator}>+1</Text>
            </Pressable>

            {/* Période (au centre) */}
            <Pressable onPress={incrementPeriod} style={styles.scoreBox}>
              <Text style={[styles.scoreText, { color: "green" }]}>
                {currentPeriod}
              </Text>
              <Text style={styles.scoreAddIndicator}>+</Text>
            </Pressable>

            {/* Score équipe extérieure */}
            <Pressable onPress={incrementAwayScore} style={styles.scoreBox}>
              <Text style={styles.scoreText}>{awayScore}</Text>
              <Text style={styles.scoreAddIndicator}>+1</Text>
            </Pressable>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timer}</Text>
          </View>

          {/* Boutons de contrôles / Fautes */}
          <View style={styles.controlButtons}>
            {/* Fautes équipe domicile */}
            <Pressable
              style={styles.controlButton}
              onPress={incrementHomeFouls}
            >
              <Text style={styles.controlButtonValue}>{homeFouls}</Text>
              <Text style={styles.controlButtonAdd}>+</Text>
            </Pressable>

            {/* Temps mort / Pause */}
            <View style={styles.controlButton}>
              <Text style={styles.controlButtonTitle}>Pause</Text>
            </View>

            {/* Fautes équipe extérieure */}
            <Pressable
              style={styles.controlButton}
              onPress={incrementAwayFouls}
            >
              <Text style={styles.controlButtonValue}>{awayFouls}</Text>
              <Text style={styles.controlButtonAdd}>+</Text>
            </Pressable>
          </View>

          {/* Temps morts */}
          <View style={styles.timeoutsContainer}>
            {/* Temps morts équipe domicile */}
            <TouchableOpacity
              style={styles.timeoutCard}
              onPress={useHomeTimeout}
              disabled={homeTimeouts === 0}
            >
              <TimeoutIndicator remaining={homeTimeouts} />
            </TouchableOpacity>

            {/* Temps morts équipe extérieure */}
            <TouchableOpacity
              style={styles.timeoutCard}
              onPress={useAwayTimeout}
              disabled={awayTimeouts === 0}
            >
              <TimeoutIndicator remaining={awayTimeouts} />
            </TouchableOpacity>
          </View>

          {/* Bouton retour en bas */}
          <View style={styles.bottomButton}>
            <Button variant="outline" size="lg" onPress={() => router.back()}>
              <Text className="text-xl">Retour</Text>
            </Button>
          </View>
        </View>

        {/* Carte équipe extérieure (droite) */}
        <Card style={styles.teamCard}>
          <CardHeader>
            <CardTitle style={styles.teamName}>
              {awayTeam?.name || "Équipe Extérieure"}
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.teamCardContent}>
            <ScrollView>
              {awayTeam?.players && awayTeam.players.length > 0 ? (
                <View style={styles.playersList}>
                  {awayTeam.players.map((player, index) =>
                    renderPlayer(player, index, false)
                  )}
                </View>
              ) : (
                <Text style={styles.noPlayers}>Aucun joueur</Text>
              )}
            </ScrollView>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  mainContent: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  teamCard: {
    width: "22%",
    margin: 10,
    height: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  teamCardContent: {
    flex: 1,
    padding: 10,
  },
  playersList: {
    flex: 1,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerNumber: {
    fontWeight: "bold",
    marginRight: 10,
    fontSize: 16,
  },
  playerName: {
    fontSize: 16,
  },
  playerScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 6,
  },
  playerScore: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  playerScoreAdd: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "bold",
  },
  playerFoulContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  playerFoulDanger: {
    backgroundColor: "#ffeeee",
    borderColor: "#ffcccc",
  },
  playerFoulText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noPlayers: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
    color: "#999",
  },
  centerContent: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
  },
  scoreBox: {
    backgroundColor: "white",
    height: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    margin: "2%",
  },
  scoreText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#3a0000",
  },
  scoreAddIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 14,
    color: "#777",
  },
  timerContainer: {
    backgroundColor: "white",
    height: 100,
    width: "96%",

    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    width: 100,
    fontSize: 36,
    fontWeight: "bold",
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  controlButton: {
    backgroundColor: "white",
    height: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    margin: "2%",
  },
  controlButtonTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
    marginBottom: 5,
  },
  controlButtonValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  controlButtonAdd: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "bold",
  },
  bottomButton: {
    marginTop: "auto",
    marginBottom: 20,
  },
  // Styles pour les temps morts
  timeoutsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 20,
  },
  timeoutCard: {
    width: "45%",
    height: 90,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0d0d0",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timeoutTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  timeoutIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  timeoutIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  timeoutIndicatorActive: {
    backgroundColor: "#4cd964", // Vert pour les temps morts disponibles
  },
  timeoutIndicatorInactive: {
    backgroundColor: "#e0e0e0", // Gris pour les temps morts utilisés
  },
});
