import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSportsStore } from "../store/sportsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportConfigForm } from "./SportConfigForm";
import { PlayersList } from "./PlayersList";
import { useRouter } from "expo-router";

// Onglets disponibles
enum TabType {
  CONFIG = "config",
  PLAYERS = "players",
}

export function SportsScreen() {
  const router = useRouter();
  const { sports, selectedSport, selectSport, clearSelection } =
    useSportsStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.PLAYERS);

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleSportChange = (
    option: { value: string; label: string } | undefined
  ) => {
    if (option) {
      const sport = sports.find((s) => s.id === option.value);
      if (sport) {
        selectSport(sport);
      }
    } else {
      clearSelection();
    }
  };

  const handleStartMatch = () => {
    if (selectedSport) {
      router.push({
        pathname: "/match",
        params: { sportId: selectedSport.id },
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-6 text-foreground">
            Sports disponibles
          </Text>

          <Select
            value={
              selectedSport
                ? { value: selectedSport.id, label: selectedSport.name }
                : undefined
            }
            onValueChange={handleSportChange}
          >
            <SelectTrigger className="w-full mb-4">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder="Sélectionner un sport"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full">
              <SelectGroup>
                {sports.map((sport) => (
                  <SelectItem
                    key={sport.id}
                    value={sport.id}
                    label={sport.name}
                  >
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedSport && (
            <View className="mt-6 p-4 bg-card rounded-lg">
              {/* Sélection d'onglets */}
              <View className="flex-row border-b border-border">
                <TouchableTab
                  isActive={activeTab === TabType.CONFIG}
                  onPress={() => setActiveTab(TabType.CONFIG)}
                  label="Configuration"
                />
                <TouchableTab
                  isActive={activeTab === TabType.PLAYERS}
                  onPress={() => setActiveTab(TabType.PLAYERS)}
                  label="Joueurs"
                />
              </View>

              {/* Contenu des onglets */}
              {activeTab === TabType.CONFIG &&
                selectedSport.id === "basketball" && (
                  <SportConfigForm sport={selectedSport} />
                )}

              {activeTab === TabType.PLAYERS && (
                <PlayersList sportId={selectedSport.id} />
              )}

              {/* Infos du sport et bouton Démarrer */}
              <View className="mt-6 pt-4 border-t border-border">
                <TouchableOpacity
                  className="w-full py-4 bg-primary rounded-lg"
                  onPress={handleStartMatch}
                >
                  <Text className="text-center text-lg font-bold text-primary-foreground">
                    DÉMARRER LE MATCH
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Composant d'onglet
interface TouchableTabProps {
  isActive: boolean;
  onPress: () => void;
  label: string;
}

function TouchableTab({ isActive, onPress, label }: TouchableTabProps) {
  return (
    <TouchableOpacity
      className={`py-2 px-4 ${
        isActive
          ? "bg-primary rounded-t-lg border-b-2 border-primary"
          : "border-b-2 border-transparent"
      }`}
      onPress={onPress}
    >
      <Text
        className={`font-medium ${
          isActive ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
