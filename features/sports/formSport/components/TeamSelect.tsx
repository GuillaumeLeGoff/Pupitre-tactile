import React from "react";
import { View } from "react-native";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Card, CardTitle, CardHeader, CardContent } from "~/components/ui/card";
import { useTeamSelection } from "../store/teamStore";
import { useSportSelected } from "../../selectSport/store/sportSelected";
import { useFocusEffect } from "expo-router";
import { Button } from "~/components/ui/button";
import { useTeams } from "../hooks/useTeams";
import { PenIcon } from "~/lib/icons/Pen";

export function TeamSelect() {
  const { homeTeam, awayTeam } = useTeamSelection();
  const { sport } = useSportSelected();
  const { teams, handleTeamSelect, openTeamManagement } = useTeams(sport);

  return (
    <Card style={{ height: "100%" }} className="flex-1">
      <CardHeader>
        <CardTitle>Équipes</CardTitle>
      </CardHeader>
      <CardContent>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "40%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Select
                  onValueChange={(data) => {
                    handleTeamSelect(data?.value, true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        homeTeam?.name || "Sélectionnez la 1ère équipe"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem
                        key={team.id}
                        label={team.name}
                        value={team.id}
                      />
                    ))}
                    <SelectItem
                      label="Ajouter une nouvelle équipe"
                      value="add"
                    />
                  </SelectContent>
                </Select>
              </View>
              {homeTeam && (
                <Button
                  variant="ghost"
                  onPress={() => openTeamManagement(homeTeam.id)}
                  className="ml-2"
                >
                  <PenIcon />
                </Button>
              )}
            </View>
          </View>
          <View style={{ width: "40%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Select
                  onValueChange={(data) => {
                    handleTeamSelect(data?.value, false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        awayTeam?.name || "Sélectionnez la 2ème équipe"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem
                        key={team.id}
                        label={team.name}
                        value={team.id}
                      />
                    ))}
                    <SelectItem
                      label="Ajouter une nouvelle équipe"
                      value="add"
                    />
                  </SelectContent>
                </Select>
              </View>
              {awayTeam && (
                <Button
                  variant="ghost"
                  onPress={() => openTeamManagement(awayTeam.id)}
                  className="ml-2"
                >
                  <PenIcon />
                </Button>
              )}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
