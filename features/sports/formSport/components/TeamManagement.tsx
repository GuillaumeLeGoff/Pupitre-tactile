import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Team, Player } from "../../types/sportsTypes";
import { useSportSelected } from "../../selectSport/store/sportSelected";
import { useTeams } from "../hooks/useTeams";
import { useTeamSelection } from "../store/teamStore";

export default function TeamManagementScreen() {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const { sport } = useSportSelected();
  const { updateTeamName, confirmDeleteTeam, addPlayer } = useTeams(sport);
  const { homeTeam, awayTeam, selectedTeam } = useTeamSelection();

  // États pour le formulaire d'ajout de joueur
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNumber, setNewPlayerNumber] = useState("");

  // Fonction pour gérer l'ajout d'un joueur
  const handleAddPlayer = () => {
    if (!selectedTeam) return;

    addPlayer(newPlayerName, newPlayerNumber);
    setNewPlayerName("");
    setNewPlayerNumber("");
  };

  if (!selectedTeam) {
    return (
      <View style={styles.container}>
        <Text>Équipe non trouvée</Text>
        <Button onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  // Vérifier si l'équipe est sélectionnée comme équipe domicile ou extérieur
  const isHomeTeam = homeTeam?.id === selectedTeam.id;
  const isAwayTeam = awayTeam?.id === selectedTeam.id;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Gérer l'équipe</CardTitle>
          {(isHomeTeam || isAwayTeam) && (
            <Text style={styles.teamStatus}>
              {isHomeTeam ? "Équipe domicile" : "Équipe extérieur"}
            </Text>
          )}
        </CardHeader>
        <CardContent>
          {/* Formulaire de modification du nom de l'équipe */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nom de l'équipe</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={selectedTeam.name}
                onChangeText={updateTeamName}
                placeholder="Nom de l'équipe"
              />
            </View>
          </View>

          {/* Formulaire d'ajout de joueur */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajouter un joueur</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Nom du joueur"
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={newPlayerNumber}
                onChangeText={setNewPlayerNumber}
                placeholder="Numéro"
                keyboardType="number-pad"
              />
              <Button onPress={handleAddPlayer}>Ajouter</Button>
            </View>
          </View>

          {/* Liste des joueurs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Joueurs ({selectedTeam.players?.length || 0})
            </Text>
            <FlatList
              data={selectedTeam.players || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.playerItem}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerNumber}>#{item.number}</Text>
                    <Text style={styles.playerName}>{item.name}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Aucun joueur dans cette équipe
                </Text>
              }
            />
          </View>
        </CardContent>
        <CardFooter style={styles.footer}>
          <Button onPress={() => router.back()}>Retour</Button>
          <Button
            variant="destructive"
            onPress={() => confirmDeleteTeam(selectedTeam.id, isHomeTeam)}
            className="bg-red-500"
          >
            Supprimer l'équipe
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  numberInput: {
    width: 80,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerNumber: {
    fontWeight: "bold",
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
