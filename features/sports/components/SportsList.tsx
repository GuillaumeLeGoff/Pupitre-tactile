import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSportsStore } from '../store/sportsStore';
import { SportIcon } from './SportIcon';

export function SportsList() {
  const { sports, selectedSport, selectSport } = useSportsStore();

  return (
    <View className="flex-1">
      <Text className="text-xl font-bold mb-4 text-foreground">Choisir un sport</Text>
      
      <FlatList
        data={sports}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <SportIcon 
            sport={item} 
            isSelected={selectedSport?.id === item.id}
            onPress={() => selectSport(item)}
          />
        )}
      />
    </View>
  );
} 