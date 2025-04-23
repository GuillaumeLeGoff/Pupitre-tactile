import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Dumbbell } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#007AFF',
      headerShown: false,
      tabBarStyle: { display: 'none' }
    }}>
      
      <Tabs.Screen
        name="sports"
        options={{
          title: 'Sports',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 