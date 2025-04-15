import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useSportsStore } from "../store/sportsStore";
import { Match } from "../types/sportsTypes";
import { MatchForm } from "./MatchForm";

interface MatchesListProps {
  sportId: string;
}

export function MatchesList({ sportId }: MatchesListProps) {
  const { selectedSport, deleteMatch } = useSportsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const matches = selectedSport?.matches || [];

  const handleAddMatch = () => {
    setSelectedMatch(null);
    setShowAddForm(true);
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setShowAddForm(true);
  };

  const handleDeleteMatch = (matchId: string) => {
    Alert.alert(
      "Supprimer le match",
      "Êtes-vous sûr de vouloir supprimer ce match ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => deleteMatch(sportId, matchId),
          style: "destructive",
        },
      ]
    );
  };

  const renderMatchItem = ({ item }: { item: Match }) => (
    <View className="bg-card p-3 rounded-md mb-2 border border-border">
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold text-foreground">{item.name}</Text>
        {item.date && (
          <Text className="text-sm text-muted-foreground">{item.date}</Text>
        )}
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-1">
          <Text className="text-sm font-medium text-foreground">
            {item.homeTeam.name} (#{item.homeTeam.number})
          </Text>
        </View>

        <Text className="mx-2 text-foreground">vs</Text>

        <View className="flex-1 items-end">
          <Text className="text-sm font-medium text-foreground">
            {item.awayTeam.name} (#{item.awayTeam.number})
          </Text>
        </View>
      </View>

      <View className="flex-row justify-end mt-2 space-x-2">
        <TouchableOpacity
          className="px-3 py-1 rounded-sm bg-muted"
          onPress={() => handleEditMatch(item)}
        >
          <Text className="text-xs text-foreground">Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-1 rounded-sm bg-destructive"
          onPress={() => handleDeleteMatch(item.id)}
        >
          <Text className="text-xs text-destructive-foreground">Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-foreground">Matchs</Text>
        <TouchableOpacity
          className="px-3 py-1 rounded-md bg-primary"
          onPress={handleAddMatch}
        >
          <Text className="text-primary-foreground">Ajouter un match</Text>
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <MatchForm
          sportId={sportId}
          match={selectedMatch || undefined}
          onClose={() => {
            setShowAddForm(false);
            setSelectedMatch(null);
          }}
        />
      ) : matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          className="max-h-96"
        />
      ) : (
        <View className="p-4 bg-muted rounded-md">
          <Text className="text-center text-muted-foreground">
            Aucun match enregistré pour ce sport.
          </Text>
        </View>
      )}
    </View>
  );
}
