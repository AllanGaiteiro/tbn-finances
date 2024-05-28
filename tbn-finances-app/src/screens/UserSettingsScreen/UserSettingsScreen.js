import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { firebaseService } from '../../settings/FirebaseService';

export const UserSettingsScreen = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangeEmail = async () => {
    try {
      await firebaseService.changeEmail(currentEmail, newEmail, currentPassword);
      Alert.alert("Email alterado com sucesso!");
    } catch (error) {
      // Trata os possíveis erros
      let errorMessage = "Ocorreu um erro ao alterar o email.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Credencial inválida. Por favor, verifique suas credenciais.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha atual incorreta.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "O novo email já está em uso por outra conta.";
      } else {
        errorMessage = error.message; // Mensagem de erro padrão
      }
      Alert.alert("Erro ao alterar email", errorMessage);
    }
  };

  const handleChangePassword = async () => {
    try {
      await firebaseService.changePassword(currentPassword, newPassword);
      Alert.alert("Senha alterada com sucesso!");
    } catch (error) {
      // Trata o erro 'auth/invalid-credential'
      let errorMessage = "Ocorreu um erro ao alterar a senha.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Credencial inválida. Por favor, verifique suas credenciais.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha atual incorreta.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A nova senha é muito fraca. Por favor, escolha uma senha mais segura.";
      } else {
        errorMessage = error.message; // Mensagem de erro padrão
      }
      Alert.alert("Erro ao alterar senha", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alteração de Email</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alteração de Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button title="Alterar Senha" onPress={handleChangePassword} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
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
