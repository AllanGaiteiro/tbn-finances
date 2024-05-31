import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { handleFirebaseError } from '../../../settings/errorHandling';
import { userAuthService } from '../../../services/UserAuthService';
import { useUser } from '../../../providers/UserProvider';

export const EditDisplayName = () => {
  const { user } = useUser();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [expandDisplayName, setDisplayName] = useState(false);

  const handleChangeDisplayName = () => userAuthService.changeDisplayName(newDisplayName);

  return (
    <TouchableOpacity onPress={() => setDisplayName(!expandDisplayName)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alteração o Nome</Text>
        {expandDisplayName && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Novo nome"
              value={newDisplayName}
              onChangeText={setNewDisplayName}
              autoCapitalize="none"
            />

            <Button title="Alterar Nome" onPress={handleChangeDisplayName} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});
