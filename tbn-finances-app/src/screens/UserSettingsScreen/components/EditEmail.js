import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { handleFirebaseError } from '../../../settings/errorHandling';
import { userAuthService } from '../../../services/UserAuthService';


export const EditEmail = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [expandEmail, setExpandEmail] = useState(false);

  const handleChangeEmail = async () => {
    try {
      await userAuthService.changeEmail(currentEmail, newEmail, currentPassword);
      Alert.alert("Email alterado com sucesso!");
    } catch (error) {
      const errorMessage = handleFirebaseError(error); // Utiliza a função de tratamento de erros
      Alert.alert("Erro ao alterar email", errorMessage);
    }
  };

  return (
    <TouchableOpacity onPress={() => setExpandEmail(!expandEmail)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alteração de Email</Text>
        {expandEmail && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email atual"
              value={currentEmail}
              onChangeText={setCurrentEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Novo email"
              value={newEmail}
              onChangeText={setNewEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Button title="Alterar Email" onPress={handleChangeEmail} />
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