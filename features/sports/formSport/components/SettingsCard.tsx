import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "~/lib/icons/Save";
import { useGameSettings, GameMode } from "../store/gameSettings";

export const SettingsCard = () => {
  const gameSettings = useGameSettings();
  const [modeModalVisible, setModeModalVisible] = useState(false);

  const openModeSelector = () => setModeModalVisible(true);
  const closeModeSelector = () => setModeModalVisible(false);

  const selectMode = (value: GameMode) => {
    gameSettings.setSelectedMode(value);
    closeModeSelector();
  };

  const gameModes = [
    { label: "Mode classique", value: "classic" as GameMode },
    { label: "Mode rapide", value: "quick" as GameMode },
    { label: "Mode entraînement", value: "training" as GameMode },
    { label: "Mode tournoi", value: "tournament" as GameMode },
  ];

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
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm font-medium">Mode de jeu</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              style={styles.selectButton}
              onPress={openModeSelector}
            >
              <Text style={styles.selectText}>
                {gameSettings.selectedMode
                  ? gameModes.find(mode => mode.value === gameSettings.selectedMode)?.label
                  : "Sélectionnez un mode"}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={modeModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={closeModeSelector}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Sélectionnez un mode de jeu</Text>
                  
                  <FlatList
                    data={gameModes}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modeItem}
                        onPress={() => selectMode(item.value)}
                      >
                        <Text style={styles.modeName}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModeSelector}
                  >
                    <Text style={styles.closeButtonText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>

            <Button variant="ghost" className="ml-2">
              <SaveIcon className="h-4 w-4" />
            </Button>
          </View>
        </View>

        <View style={styles.parametersContainer}>
          {gameSettings.selectedMode ? (
            <View style={styles.columnsContainer}>
              {renderFirstColumn()}
              {renderSecondColumn()}
              {renderThirdColumn()}
            </View>
          ) : (
            <View className="justify-center items-center  p-5">
              <Text
                style={{
                  color: "#c9c9c9",
                  textAlign: "center",
                }}
                className="text-sm font-medium"
              >
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
  selectButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    minHeight: 48,
    justifyContent: "center",
    width: 300,
  },
  selectText: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modeItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  modeName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
