import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { SportGrid } from './components/SportGrid';

export default function SelectSportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SportGrid />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
}); 