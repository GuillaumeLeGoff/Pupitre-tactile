import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { useGameSettings, GameMode } from "../store/gameSettings";

export const SettingsCard = () => {
  const gameSettings = useGameSettings();

  // Composant pour un élément de paramètre
  const ParameterItem = ({
    label,
    input,
  }: {
    label: string;
    input: React.ReactNode;
  }) => (
    <View style={styles.parameterRow}>
      <Text className="text-sm text-foreground">{label}</Text>
      {input}
    </View>
  );

  // Divise les paramètres en trois colonnes
  const renderFirstColumn = () => (
    <View style={styles.column}>
      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">Minuteurs</Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Minuteur avant match"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.preMatchTimer}
              onChangeText={gameSettings.setPreMatchTimer}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
        <ParameterItem
          label="Minuteur de prolongation"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.overtimeTimer}
              onChangeText={gameSettings.setOvertimeTimer}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">Périodes</Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Nombre de périodes"
          input={
            <TextInput
              style={styles.numberInput}
              value={gameSettings.periodCount}
              onChangeText={gameSettings.setPeriodCount}
              keyboardType="number-pad"
            />
          }
        />
        <ParameterItem
          label="Durée des périodes"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.periodDuration}
              onChangeText={gameSettings.setPeriodDuration}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
      </View>
    </View>
  );

  const renderSecondColumn = () => (
    <View style={styles.column}>
      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">Pauses</Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Pause principale"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.mainBreak}
              onChangeText={gameSettings.setMainBreak}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
        <ParameterItem
          label="Pause secondaire"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.secondaryBreak}
              onChangeText={gameSettings.setSecondaryBreak}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
        <ParameterItem
          label="Pause avant prolongation"
          input={
            <TextInput
              style={styles.timeInput}
              value={gameSettings.overtimeBreak}
              onChangeText={gameSettings.setOvertimeBreak}
              keyboardType="numbers-and-punctuation"
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">
          Temps morts
        </Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Nombre de temps morts"
          input={
            <TextInput
              style={styles.numberInput}
              value={gameSettings.timeoutsCount}
              onChangeText={gameSettings.setTimeoutsCount}
              keyboardType="number-pad"
            />
          }
        />
      </View>
    </View>
  );

  const renderThirdColumn = () => (
    <View style={styles.column}>
      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">Chronos</Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Activer les chronos"
          input={
            <Switch
              checked={gameSettings.chronosEnabled}
              onCheckedChange={gameSettings.setChronosEnabled}
            />
          }
        />
        {gameSettings.chronosEnabled && (
          <>
            <ParameterItem
              label="Mode décompte"
              input={
                <Switch
                  checked={gameSettings.chronosCountdown}
                  onCheckedChange={gameSettings.setChronosCountdown}
                />
              }
            />
            <ParameterItem
              label="Durée chrono 1 (sec)"
              input={
                <TextInput
                  style={styles.numberInput}
                  value={gameSettings.chronosDuration1}
                  onChangeText={gameSettings.setChronosDuration1}
                  keyboardType="number-pad"
                />
              }
            />
            <ParameterItem
              label="Durée chrono 2 (sec)"
              input={
                <TextInput
                  style={styles.numberInput}
                  value={gameSettings.chronosDuration2}
                  onChangeText={gameSettings.setChronosDuration2}
                  keyboardType="number-pad"
                />
              }
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text className="text-base font-bold mb-2 text-primary">Affichage</Text>
        <View style={styles.separator} />
        <ParameterItem
          label="Afficher carré rouge"
          input={
            <Switch
              checked={gameSettings.showRedSquare}
              onCheckedChange={gameSettings.setShowRedSquare}
            />
          }
        />
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent style={styles.content}>
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2">Mode de jeu</Text>
          <Select
            value={gameSettings.selectedMode || undefined}
            onValueChange={(value) => {
              console.log("Mode sélectionné:", value);
              if (value) {
                gameSettings.setSelectedMode(value as any);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem label="Mode classique" value="classic" />
              <SelectItem label="Mode rapide" value="quick" />
              <SelectItem label="Mode entraînement" value="training" />
              <SelectItem label="Mode tournoi" value="tournament" />
            </SelectContent>
          </Select>
        </View>

        <View style={styles.parametersContainer}>
          {gameSettings.selectedMode ? (
            <View style={styles.columnsContainer}>
              {renderFirstColumn()}
              {renderSecondColumn()}
              {renderThirdColumn()}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center p-5">
              <Text className="text-sm font-medium text-center text-gray-500">
                Veuillez sélectionner un mode de jeu pour configurer les
                paramètres
              </Text>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: "100%",
  },
  modeNotSelected: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    flex: 1,
  },
  parametersContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  column: {
    flex: 1,
    minWidth: 200,
    marginHorizontal: 6,
  },
  section: {
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginBottom: 12,
  },
  parameterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 90,
    textAlign: "center",
    backgroundColor: "white",
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    textAlign: "center",
    backgroundColor: "white",
  },
});
