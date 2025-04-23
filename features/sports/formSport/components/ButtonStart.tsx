import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Text } from 'react-native';

export const ButtonStart = () => {
  return (
    <Button
      variant="default"
      size="lg"
      className="flex-1 h-full w-full"
      style={{ width: '100%', height: '100%' }}
      onPress={() => {
        // TODO: Ajouter la logique de démarrage
      }}
    >
      <Text style={{ color: 'white', fontSize:60, fontWeight: 'bold' }}>JOUER</Text>
    </Button>
  );
};
