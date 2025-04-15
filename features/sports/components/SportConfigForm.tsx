import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Switch } from "react-native";
import { Sport, SportConfig } from "../types/sportsTypes";
import { useSportsStore } from "../store/sportsStore";

interface SportConfigFormProps {
  sport: Sport;
}

export function SportConfigForm({ sport }: SportConfigFormProps) {
  const { updateSportConfig } = useSportsStore();
  const [config, setConfig] = useState<SportConfig>(
    sport.config || {
      preMatchTimer: "00:00",
      overtimeTimer: "00:00",
      periods: { count: 4, duration: "00:00" },
      breakTimes: {
        main: "00:00",
        secondary: "00:00",
        beforeOvertime: "00:00",
      },
      chronos: {
        enabled: true,
        countdown: true,
        durations: ["24", "14"],
      },
      timeouts: {
        count: 3,
      },
      display: {
        showRedSquare: true,
      },
    }
  );

  // Mettre à jour le formulaire si le sport change, mais pas à cause des mises à jour du config local
  useEffect(() => {
    if (sport.config !== config) {
      setConfig(
        sport.config || {
          preMatchTimer: "00:00",
          overtimeTimer: "00:00",
          periods: { count: 4, duration: "00:00" },
          breakTimes: {
            main: "00:00",
            secondary: "00:00",
            beforeOvertime: "00:00",
          },
          chronos: {
            enabled: true,
            countdown: true,
            durations: ["24", "14"],
          },
          timeouts: {
            count: 3,
          },
          display: {
            showRedSquare: true,
          },
        }
      );
    }
  }, [sport.id]); // Ne dépend que de l'ID du sport, pas de la config

  // Fonction pour mettre à jour le store, mais de façon différée pour éviter les boucles
  const syncConfigWithStore = useCallback(
    (newConfig: SportConfig) => {
      // Utiliser setTimeout pour sortir du cycle de rendu React
      setTimeout(() => {
        updateSportConfig(sport.id, newConfig);
      }, 0);
    },
    [sport.id, updateSportConfig]
  );

  // Formater une valeur au format mm:ss
  const formatTimer = (value: string): string => {
    // Extraire tous les chiffres, qu'il y ait ":" ou pas
    const allDigits = value.replace(/[^0-9]/g, "");

    // Si aucun chiffre, retourner 00:00
    if (!allDigits) return "00:00";

    // On considère toujours les 4 derniers chiffres au maximum
    const relevantDigits = allDigits.slice(-4).padStart(4, "0");

    // Former le temps au format mm:ss
    const minutes = relevantDigits.slice(0, 2);
    const seconds = relevantDigits.slice(2, 4);

    return `${minutes}:${seconds}`;
  };

  // Mettre à jour une valeur de timer
  const updateTimer = (
    key: keyof Omit<
      SportConfig,
      "periods" | "breakTimes" | "chronos" | "timeouts" | "display"
    >,
    value: string
  ) => {
    const formattedValue = formatTimer(value);
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: formattedValue };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour les périodes
  const updatePeriods = (
    key: keyof NonNullable<SportConfig["periods"]>,
    value: string | number
  ) => {
    setConfig((prev) => {
      const newPeriods = {
        ...(prev.periods || { count: 4, duration: "00:00" }),
        [key]: key === "duration" ? formatTimer(value as string) : value,
      };
      const newConfig = { ...prev, periods: newPeriods };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour les temps de repos
  const updateBreakTime = (
    key: keyof NonNullable<SportConfig["breakTimes"]>,
    value: string
  ) => {
    const formattedValue = formatTimer(value);
    setConfig((prev) => {
      const newBreakTimes = {
        ...(prev.breakTimes || {
          main: "00:00",
          secondary: "00:00",
          beforeOvertime: "00:00",
        }),
        [key]: formattedValue,
      };
      const newConfig = { ...prev, breakTimes: newBreakTimes };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour les chronos
  const updateChronos = (
    key: keyof NonNullable<SportConfig["chronos"]>,
    value: any
  ) => {
    setConfig((prev) => {
      const defaultDurations: [string, string] = ["24", "14"];
      const newChronos = {
        ...(prev.chronos || {
          enabled: true,
          countdown: true,
          durations: defaultDurations,
        }),
        [key]: value,
      };
      const newConfig = { ...prev, chronos: newChronos };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour la durée d'un chrono spécifique
  const updateChronoDuration = (index: 0 | 1, value: string) => {
    setConfig((prev) => {
      const durations: [string, string] = [
        prev.chronos?.durations?.[0] || "24",
        prev.chronos?.durations?.[1] || "14",
      ];
      durations[index] = value;
      const newChronos = {
        ...(prev.chronos || {
          enabled: true,
          countdown: true,
          durations: ["24", "14"] as [string, string],
        }),
        durations,
      };
      const newConfig = { ...prev, chronos: newChronos };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour les temps morts
  const updateTimeouts = (
    key: keyof NonNullable<SportConfig["timeouts"]>,
    value: number
  ) => {
    setConfig((prev) => {
      const newTimeouts = {
        ...(prev.timeouts || { count: 3 }),
        [key]: value,
      };
      const newConfig = { ...prev, timeouts: newTimeouts };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  // Mettre à jour les options d'affichage
  const updateDisplay = (
    key: keyof NonNullable<SportConfig["display"]>,
    value: boolean
  ) => {
    setConfig((prev) => {
      const newDisplay = {
        ...(prev.display || { showRedSquare: true }),
        [key]: value,
      };
      const newConfig = { ...prev, display: newDisplay };
      syncConfigWithStore(newConfig);
      return newConfig;
    });
  };

  return (
    <View className="mt-4 space-y-4">
      <Text className="text-lg font-semibold text-foreground">
        Configuration du {sport.name}
      </Text>

      {/* Timers principaux */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Timers</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Avant match</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.preMatchTimer}
              onChangeText={(value) => updateTimer("preMatchTimer", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Prolongation</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.overtimeTimer}
              onChangeText={(value) => updateTimer("overtimeTimer", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Périodes */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Périodes</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Nombre</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.periods?.count.toString() || "4"}
              onChangeText={(value) =>
                updatePeriods("count", parseInt(value) || 4)
              }
              placeholder="4"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Durée</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.periods?.duration || "00:00"}
              onChangeText={(value) => updatePeriods("duration", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Chronos */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Chronos</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Activer les chronos</Text>
            <View className="w-2/5 flex items-end">
              <Switch
                value={config.chronos?.enabled}
                onValueChange={(value) => updateChronos("enabled", value)}
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Mode décompte</Text>
            <View className="w-2/5 flex items-end">
              <Switch
                value={config.chronos?.countdown}
                onValueChange={(value) => updateChronos("countdown", value)}
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Durée chrono 1 (s)</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.chronos?.durations[0] || "24"}
              onChangeText={(value) => updateChronoDuration(0, value)}
              placeholder="24"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Durée chrono 2 (s)</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.chronos?.durations[1] || "14"}
              onChangeText={(value) => updateChronoDuration(1, value)}
              placeholder="14"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Temps morts */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Temps morts</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Nombre de temps morts</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.timeouts?.count.toString() || "3"}
              onChangeText={(value) =>
                updateTimeouts("count", parseInt(value) || 3)
              }
              placeholder="3"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Options d'affichage */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Affichage</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Afficher carré rouge</Text>
            <View className="w-2/5 flex items-end">
              <Switch
                value={config.display?.showRedSquare}
                onValueChange={(value) => updateDisplay("showRedSquare", value)}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Temps de repos */}
      <View className="space-y-2">
        <Text className="font-medium text-foreground">Temps de repos</Text>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Principal</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.breakTimes?.main || "00:00"}
              onChangeText={(value) => updateBreakTime("main", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Secondaire</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.breakTimes?.secondary || "00:00"}
              onChangeText={(value) => updateBreakTime("secondary", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground w-2/5">Avant prolongation</Text>
            <TextInput
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground w-2/5"
              value={config.breakTimes?.beforeOvertime || "00:00"}
              onChangeText={(value) => updateBreakTime("beforeOvertime", value)}
              placeholder="00:00"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
