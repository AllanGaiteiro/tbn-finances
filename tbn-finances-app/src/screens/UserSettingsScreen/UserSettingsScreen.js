// UserSettingsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { EditPassword } from './components/EditPassword';
import { EditEmail } from './components/EditEmail';
import { EditDisplayName } from './components/EditDisplayName';
import { useUser } from '../../providers/UserProvider';

export const UserSettingsScreen = () => {
  const { user } = useUser()
  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Ola, {user.displayName}</Text>
      <EditDisplayName />
      <EditEmail />
      <EditPassword />

    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});


