import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Sport } from '../../types/sportsTypes';
import useSportHooks from '../hooks/sportHooks';

const SPORTS: Sport[] = [
  { id: 'basketball', icon: require('../../../../assets/icons/BasketBall.png'), name: 'Basketball' },
  { id: 'volleyball', icon: require('../../../../assets/icons/Volley.png'), name: 'Volleyball' },
  { id: 'tennis', icon: require('../../../../assets/icons/Tennis.png'), name: 'Tennis' },
  { id: 'soccer', icon: require('../../../../assets/icons/Soccer.png'), name: 'Football' },
  { id: 'handball', icon: require('../../../../assets/icons/HandBall.png'), name: 'Handball' },
  { id: 'badminton', icon: require('../../../../assets/icons/Badminton.png'), name: 'Badminton' },
  { id: 'tableTennis', icon: require('../../../../assets/icons/TableTennis.png'), name: 'Tennis de table' },
  { id: 'hockey', icon: require('../../../../assets/icons/Hockey.png'), name: 'Hockey' },
  { id: 'swimming', icon: require('../../../../assets/icons/Swimming.png'), name: 'Natation' },
  { id: 'waterPolo', icon: require('../../../../assets/icons/WaterPolo.png'), name: 'Water-polo' },
  { id: 'squash', icon: require('../../../../assets/icons/Squash.png'), name: 'Squash' },
  { id: 'rugby', icon: require('../../../../assets/icons/Rubgy.png'), name: 'Rugby' },
];

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 6;
const SPACING = 100;
const GRID_ITEM_SIZE = (width - (NUM_COLUMNS ) * SPACING) / NUM_COLUMNS;
const ICON_RATIO = 0.5; // Ratio de la taille de l'icône par rapport à son conteneur

export const SportGrid = () => {
 
  const { handleSportSelected } = useSportHooks();
  return (
    <View className="px-2.5 ">
      <View className="flex-row flex-wrap ">
        {SPORTS.map((sport) => (
          <TouchableOpacity
            key={sport.id}
            className="items-center"
            style={{
              width: GRID_ITEM_SIZE,
              margin: SPACING / 2,
            }}
            onPress={() => handleSportSelected(sport)}
          >
            <View
              className="bg-card rounded-2xl border border-border items-center justify-center"
              style={{
                width: GRID_ITEM_SIZE,
                height: GRID_ITEM_SIZE,
              }}
            >
              <Image
                source={sport.icon}
                style={{
                  width: GRID_ITEM_SIZE * ICON_RATIO,
                  height: GRID_ITEM_SIZE * ICON_RATIO,
                }}
                resizeMode="contain"
              />
            </View>
            <Text className="mt-4 text-lg stext-foreground text-center">
              {sport.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}; 