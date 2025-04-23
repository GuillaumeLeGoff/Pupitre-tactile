import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

export const SettingsCard = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [periodCount, setPeriodCount] = useState("4");
  const [periodDuration, setPeriodDuration] = useState("10:00");
  const [mainBreak, setMainBreak] = useState("15:00");
  const [secondaryBreak, setSecondaryBreak] = useState("02:00");
  const [overtimeBreak, setOvertimeBreak] = useState("02:00");
  const [preMatchTimer, setPreMatchTimer] = useState("00:20");
  const [overtimeTimer, setOvertimeTimer] = useState("05:00");
  const [chronosEnabled, setChronosEnabled] = useState(false);
  const [chronosCountdown, setChronosCountdown] = useState(false);
  const [chronosDuration1, setChronosDuration1] = useState("24");
  const [chronosDuration2, setChronosDuration2] = useState("14");
  const [timeoutsCount, setTimeoutsCount] = useState("2");
  const [showRedSquare, setShowRedSquare] = useState(false);

  const handleModeChange = (value: any) => {
    setSelectedMode(value);
  };

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent style={styles.content}>
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2">Mode de jeu</Text>
          <Select onValueChange={handleModeChange}>
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
          <ScrollView>
            <Text style={styles.sectionTitle}>Minuteurs</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Minuteur avant match</Text>
              <TextInput 
                style={styles.timeInput}
                value={preMatchTimer}
                onChangeText={setPreMatchTimer}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Minuteur de prolongation</Text>
              <TextInput 
                style={styles.timeInput}
                value={overtimeTimer}
                onChangeText={setOvertimeTimer}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Périodes</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Nombre de périodes</Text>
              <TextInput 
                style={styles.numberInput}
                value={periodCount}
                onChangeText={setPeriodCount}
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Durée des périodes</Text>
              <TextInput 
                style={styles.timeInput}
                value={periodDuration}
                onChangeText={setPeriodDuration}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Pauses</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Pause principale</Text>
              <TextInput 
                style={styles.timeInput}
                value={mainBreak}
                onChangeText={setMainBreak}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Pause secondaire</Text>
              <TextInput 
                style={styles.timeInput}
                value={secondaryBreak}
                onChangeText={setSecondaryBreak}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Pause avant prolongation</Text>
              <TextInput 
                style={styles.timeInput}
                value={overtimeBreak}
                onChangeText={setOvertimeBreak}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Chronos</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Activer les chronos</Text>
              <Switch value={chronosEnabled} onValueChange={setChronosEnabled} />
            </View>
            
            {chronosEnabled && (
              <>
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>Mode décompte</Text>
                  <Switch value={chronosCountdown} onValueChange={setChronosCountdown} />
                </View>
                
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>Durée chrono 1 (sec)</Text>
                  <TextInput 
                    style={styles.numberInput}
                    value={chronosDuration1}
                    onChangeText={setChronosDuration1}
                    keyboardType="number-pad"
                  />
                </View>
                
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>Durée chrono 2 (sec)</Text>
                  <TextInput 
                    style={styles.numberInput}
                    value={chronosDuration2}
                    onChangeText={setChronosDuration2}
                    keyboardType="number-pad"
                  />
                </View>
              </>
            )}
            
            <Text style={styles.sectionTitle}>Temps morts</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Nombre de temps morts</Text>
              <TextInput 
                style={styles.numberInput}
                value={timeoutsCount}
                onChangeText={setTimeoutsCount}
                keyboardType="number-pad"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Affichage</Text>
            
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>Afficher carré rouge</Text>
              <Switch value={showRedSquare} onValueChange={setShowRedSquare} />
            </View>
          </ScrollView>
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
  content: {
    flex: 1,
  },
  parametersContainer: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  parameterLabel: {
    fontSize: 14,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    textAlign: 'center',
    backgroundColor: 'white',
  },
}); 