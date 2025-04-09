import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BadmintonIcon } from '../../../lib/icons/BadmintonIcon';
import { BasketballIcon } from '../../../lib/icons/BasketballIcon';
import { BoxeIcon } from '../../../lib/icons/BoxeIcon';
import { FieldHockeyIcon } from '../../../lib/icons/FieldHockeyIcon';
import { FutbalIcon } from '../../../lib/icons/FutbalIcon';
import { FloorballIcon } from '../../../lib/icons/FloorballIcon';
import { FootIcon } from '../../../lib/icons/FootIcon';
import { NetballIcon } from '../../../lib/icons/NetballIcon';
import { VolleyIcon } from '../../../lib/icons/VolleyIcon';
import { Sport } from '../types/sportsTypes';

interface SportIconProps {
  sport: Sport;
  onPress?: () => void;
  isSelected?: boolean;
}

export function SportIcon({ sport, onPress, isSelected = false }: SportIconProps) {
  const getIcon = () => {
    switch (sport.icon) {
      case 'BadmintonIcon':
        return <BadmintonIcon className="text-primary" size={24} />;
      case 'BasketballIcon':
        return <BasketballIcon className="text-primary" size={24} />;
      case 'BoxeIcon':
        return <BoxeIcon className="text-primary" size={24} />;
      case 'FieldHockeyIcon':
        return <FieldHockeyIcon className="text-primary" size={24} />;
      case 'FutbalIcon':
        return <FutbalIcon className="text-primary" size={24} />;
      case 'FloorballIcon':
        return <FloorballIcon className="text-primary" size={24} />;
      case 'FootIcon':
        return <FootIcon className="text-primary" size={24} />;
      case 'NetballIcon':
        return <NetballIcon className="text-primary" size={24} />;
      case 'VolleyIcon':
        return <VolleyIcon className="text-primary" size={24} />;
      default:
        return null;
    }
  };

  return (
    <Pressable onPress={onPress}>
      <View className={`p-4 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted/30'} items-center justify-center`}>
        {getIcon()}
        <Text className="text-xs mt-2 text-foreground text-center">{sport.name}</Text>
      </View>
    </Pressable>
  );
} 