import React from "react";
import { Button } from "../../../../components/ui/button";
import { Text } from "react-native";
import { useGameSettings } from "../store/gameSettings";
import { useTeamSelection } from "../store/teamStore";

export const ButtonStart = () => {
  const gameSettings = useGameSettings();
  const teams = useTeamSelection();
  return (
    <Button
      variant="default"
      size="lg"
      className="flex-1 h-full w-full"
      disabled={
        teams.homeTeam === null ||
        teams.awayTeam === null ||
        gameSettings.selectedMode === null
      }
      onPress={() => {
        // TODO: Ajouter la logique de démarrage
      }}
    >
      <Text style={{ color: "white", fontSize: 60, fontWeight: "bold" }}>
        JOUER
      </Text>
    </Button>
  );
};
