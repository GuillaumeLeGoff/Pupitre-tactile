import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSportsStore } from "../store/sportsStore";
import { Match, Team } from "../types/sportsTypes";

interface MatchFormProps {
  sportId: string;
  match?: Match; // Facultatif pour la modification d'un match existant
  onClose: () => void;
}

export function MatchForm({ sportId, match, onClose }: MatchFormProps) {
  const { addMatch, updateMatch } = useSportsStore();
  const isEditing = !!match;

  const [matchName, setMatchName] = useState(match?.name || "");
  const [matchDate, setMatchDate] = useState(match?.date || "");

  const [homeTeamName, setHomeTeamName] = useState(match?.homeTeam.name || "");
  const [homeTeamNumber, setHomeTeamNumber] = useState(
    match?.homeTeam.number?.toString() || ""
  );

  const [awayTeamName, setAwayTeamName] = useState(match?.awayTeam.name || "");
  const [awayTeamNumber, setAwayTeamNumber] = useState(
    match?.awayTeam.number?.toString() || ""
  );

  const handleSave = () => {
    const homeTeam: Team = {
      id: match?.homeTeam.id || `home-${Date.now()}`,
      name: homeTeamName,
      number: parseInt(homeTeamNumber) || 0,
    };

    const awayTeam: Team = {
      id: match?.awayTeam.id || `away-${Date.now()}`,
      name: awayTeamName,
      number: parseInt(awayTeamNumber) || 0,
    };

    if (isEditing && match) {
      updateMatch(sportId, {
        ...match,
        name: matchName,
        date: matchDate,
        homeTeam,
        awayTeam,
      });
    } else {
      addMatch(sportId, {
        name: matchName,
        date: matchDate,
        homeTeam,
        awayTeam,
      });
    }

    onClose();
  };

  return (
    <View className="p-4 bg-card rounded-md space-y-4">
      <Text className="text-xl font-bold text-foreground">
        {isEditing ? "Modifier le match" : "Ajouter un match"}
      </Text>

      <View className="space-y-2">
        <Text className="text-sm font-medium text-foreground">
          Nom du match
        </Text>
        <TextInput
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
          value={matchName}
          onChangeText={setMatchName}
          placeholder="Ex: Finale championnat"
        />
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium text-foreground">Date</Text>
        <TextInput
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
          value={matchDate}
          onChangeText={setMatchDate}
          placeholder="JJ/MM/AAAA"
        />
      </View>

      <View className="bg-muted p-2 rounded-md">
        <Text className="text-sm font-bold text-foreground mb-2">
          Équipe domicile
        </Text>

        <View className="space-y-2">
          <Text className="text-xs text-foreground">Nom</Text>
          <TextInput
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
            value={homeTeamName}
            onChangeText={setHomeTeamName}
            placeholder="Nom de l'équipe"
          />
        </View>

        <View className="space-y-2 mt-2">
          <Text className="text-xs text-foreground">Numéro</Text>
          <TextInput
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
            value={homeTeamNumber}
            onChangeText={setHomeTeamNumber}
            placeholder="Numéro"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View className="bg-muted p-2 rounded-md">
        <Text className="text-sm font-bold text-foreground mb-2">
          Équipe visiteur
        </Text>

        <View className="space-y-2">
          <Text className="text-xs text-foreground">Nom</Text>
          <TextInput
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
            value={awayTeamName}
            onChangeText={setAwayTeamName}
            placeholder="Nom de l'équipe"
          />
        </View>

        <View className="space-y-2 mt-2">
          <Text className="text-xs text-foreground">Numéro</Text>
          <TextInput
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
            value={awayTeamNumber}
            onChangeText={setAwayTeamNumber}
            placeholder="Numéro"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View className="flex-row justify-end space-x-2 mt-4">
        <TouchableOpacity
          className="px-4 py-2 rounded-md bg-muted"
          onPress={onClose}
        >
          <Text className="text-foreground">Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-4 py-2 rounded-md bg-primary"
          onPress={handleSave}
        >
          <Text className="text-primary-foreground">Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
