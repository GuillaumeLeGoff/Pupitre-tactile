import React from 'react';
import { Pressable } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { MoonStar } from '../lib/icons/MoonStar';
import { Sun } from '../lib/icons/Sun';

export const ToggleTheme = () => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="h-10 w-10 rounded-full flex items-center justify-center bg-background border border-border"
    >
      {isDarkColorScheme ? <Sun className="text-foreground" /> : <MoonStar className="text-foreground" />}
    </Pressable>
  );
}; 