import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components/ui/button';
import { ToggleTheme } from '../../components/ToggleTheme';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Text className="text-2xl font-bold mb-2 text-center text-foreground">Hello World</Text>
      <Text className="text-lg text-center mb-6 text-foreground">Bienvenue sur mon application</Text>
      
      <Button className="mb-4" onPress={() => console.log('Bouton pressé')}>
        Bouton principal
      </Button>
      
      <Button variant="outline" className="mb-8">
        Bouton secondaire
      </Button>
      
      <ToggleTheme />
    </View>
  );
}

