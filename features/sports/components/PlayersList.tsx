import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { useSportsStore } from "../store/sportsStore";
import { Player } from "../types/sportsTypes";

interface PlayersListProps {
  sportId: string;
}

export function PlayersList({ sportId }: PlayersListProps) {
  const { selectedSport, addPlayer, updatePlayer, deletePlayer } =
    useSportsStore();
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [, forceUpdate] = useState({});

  const players = selectedSport?.players || [];

  // Filtrer les joueurs par équipe (numéros pairs pour équipe domicile, impairs pour équipe visiteur)
  const homeTeamPlayers = players.filter((player) => player.number % 2 === 0);
  const awayTeamPlayers = players.filter((player) => player.number % 2 === 1);

  const handleAddPlayer = () => {
    if (!playerName.trim() || !playerNumber.trim()) {
      Alert.alert(
        "Erreur",
        "Veuillez saisir un nom et un numéro pour le joueur"
      );
      return;
    }

    let number = parseInt(playerNumber);
    if (isNaN(number)) {
      Alert.alert("Erreur", "Le numéro doit être un nombre");
      return;
    }

    // S'assurer que le numéro correspond à l'équipe sélectionnée (pair pour domicile, impair pour visiteur)
    if (selectedTeam === "home" && number % 2 === 1) {
      number = number + 1; // Convertir en nombre pair
    } else if (selectedTeam === "away" && number % 2 === 0) {
      number = number + 1; // Convertir en nombre impair
    }

    if (editingPlayer) {
      // Mode édition
      updatePlayer(sportId, {
        ...editingPlayer,
        name: playerName,
        number,
      });
      setEditingPlayer(null);
    } else {
      // Mode ajout
      addPlayer(sportId, {
        name: playerName,
        number,
      });
    }

    // Réinitialiser les champs
    setPlayerName("");
    setPlayerNumber("");
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPlayerName(player.name);
    setPlayerNumber(player.number.toString());
    setSelectedTeam(player.number % 2 === 0 ? "home" : "away");
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setPlayerName("");
    setPlayerNumber("");
  };

  // Nouvelle fonction pour supprimer directement sans utiliser Alert
  const deletePlayerDirectly = useCallback(
    (playerId: string) => {
      if (!playerId || !sportId) {
        return;
      }

      // Vérification que le joueur existe
      const playerToDelete = players.find((p) => p.id === playerId);

      if (!playerToDelete) {
        return;
      }

      try {
        // Appel direct à la fonction de suppression
        deletePlayer(sportId, playerId);

        // Force une mise à jour du composant
        setTimeout(() => {
          forceUpdate({});
        }, 100);
      } catch (error) {
        // Silently handle errors
      }
    },
    [sportId, players, deletePlayer, selectedSport]
  );

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View className="flex-row items-center justify-between p-3 bg-card rounded-md mb-2 border border-border">
      <View className="flex-row items-center flex-1">
        <Text className="font-bold text-foreground bg-primary/10 rounded-full px-3 py-1 text-center w-12">
          {item.number}
        </Text>
        <Text className="ml-4 text-foreground text-lg">{item.name}</Text>
      </View>

      <View className="flex-row">
        <TouchableOpacity
          className="px-3 py-1 rounded-sm bg-muted mr-2"
          onPress={() => handleEditPlayer(item)}
        >
          <Text className="text-xs text-foreground">Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-1 rounded-sm bg-destructive"
          onPress={() => deletePlayerDirectly(item.id)}
        >
          <Text className="text-xs text-destructive-foreground">Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold text-foreground mb-4">
        Gestion des équipes
      </Text>

      {/* Sélecteur d'équipe */}
      <View className="flex-row bg-muted rounded-lg overflow-hidden mb-4">
        <TouchableOpacity
          className={`flex-1 py-2 px-4 ${
            selectedTeam === "home" ? "bg-primary" : ""
          }`}
          onPress={() => setSelectedTeam("home")}
        >
          <Text
            className={`text-center ${
              selectedTeam === "home"
                ? "text-primary-foreground"
                : "text-foreground"
            }`}
          >
            Équipe domicile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 px-4 ${
            selectedTeam === "away" ? "bg-primary" : ""
          }`}
          onPress={() => setSelectedTeam("away")}
        >
          <Text
            className={`text-center ${
              selectedTeam === "away"
                ? "text-primary-foreground"
                : "text-foreground"
            }`}
          >
            Équipe visiteur
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulaire d'ajout/modification */}
      <View className="bg-card p-4 rounded-md mb-4">
        <Text className="font-medium text-foreground mb-2">
          {editingPlayer ? "Modifier le joueur" : "Ajouter un joueur"}
        </Text>

        <View className="flex-row mb-2">
          <TextInput
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground mr-2"
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Nom du joueur"
          />

          <TextInput
            className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
            value={playerNumber}
            onChangeText={setPlayerNumber}
            placeholder="N°"
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View className="flex-row justify-end">
          {editingPlayer && (
            <TouchableOpacity
              className="px-3 py-2 rounded-md bg-muted mr-2"
              onPress={handleCancelEdit}
            >
              <Text className="text-sm text-foreground">Annuler</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="px-3 py-2 rounded-md bg-primary"
            onPress={handleAddPlayer}
          >
            <Text className="text-sm text-primary-foreground">
              {editingPlayer ? "Mettre à jour" : "Ajouter"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Listes des joueurs par équipe */}
      <View className="flex-1">
        {selectedTeam === "home" ? (
          // Liste équipe domicile
          <>
            <Text className="font-medium text-foreground mb-2">
              Équipe domicile
            </Text>
            {homeTeamPlayers.length > 0 ? (
              <FlatList
                data={homeTeamPlayers}
                renderItem={renderPlayerItem}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View className="p-4 bg-muted rounded-md">
                <Text className="text-center text-muted-foreground">
                  Aucun joueur dans l'équipe domicile.
                </Text>
              </View>
            )}
          </>
        ) : (
          // Liste équipe visiteur
          <>
            <Text className="font-medium text-foreground mb-2">
              Équipe visiteur
            </Text>
            {awayTeamPlayers.length > 0 ? (
              <FlatList
                data={awayTeamPlayers}
                renderItem={renderPlayerItem}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View className="p-4 bg-muted rounded-md">
                <Text className="text-center text-muted-foreground">
                  Aucun joueur dans l'équipe visiteur.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
