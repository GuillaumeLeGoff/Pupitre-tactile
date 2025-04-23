import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSportSelected } from '../selectSport/store/sportSelected';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TeamSelect } from './components/TeamSelect';
import { ButtonStart } from './components/ButtonStart';
import { SettingsCard } from './components/SettingsCard';

export default function FormSportScreen() {
  const { sport } = useSportSelected();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View  style={{paddingBottom: 24}} className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.navigate("/sports")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-row items-center ml-4">
          {sport?.icon && (
            <Image
              source={sport.icon}
              className="w-6 h-6 mr-4"
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          )}
          <Text className="text-2xl font-bold text-foreground">
            {sport?.name}
          </Text>
        </View>
      </View>
      
      <View style={styles.teamRow}>
        <View style={styles.teamContainer}>
          <TeamSelect />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonStart />
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <SettingsCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  teamRow: {
    flexDirection: 'row',
    marginBottom: 16
  },
  teamContainer: {
    width: '70%',
    paddingRight: 24
  },
  buttonContainer: {
    width: '30%'
  },
  settingsContainer: {
    flex: 1
  }
});


 