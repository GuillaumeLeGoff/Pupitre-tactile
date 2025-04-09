import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSportsStore } from '../store/sportsStore';
import { SportsList } from './SportsList';

export function SportsScreen() {
  const { selectedSport, clearSelection } = useSportsStore();

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-2xl font-bold mb-6 text-foreground">Sports disponibles</Text>
      
      <SportsList />
      
      {selectedSport && (
        <View className="mt-6 p-4 bg-card rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-foreground">{selectedSport.name}</Text>
            <Text 
              className="text-primary font-medium" 
              onPress={clearSelection}
            >
              Désélectionner
            </Text>
          </View>
          <Text className="mt-2 text-foreground">
            Le sport {selectedSport.name} a été sélectionné.
          </Text>
        </View>
      )}
    </View>
  );
} 