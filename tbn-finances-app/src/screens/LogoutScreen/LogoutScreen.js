import React, { useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { userAuthService } from '../../services/UserAuthService';

export const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showAlert();
    });

    return unsubscribe;
  }, [navigation]);

  const showAlert = () => {
    Alert.alert(
      "Sair",
      "Tem certeza de que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => navigation.goBack()
        },
        { text: "Sair", onPress: () => confirmLogout() }
      ],
      { cancelable: false }
    );
  };

  const confirmLogout = async () => {
    try {
      await userAuthService.logout();
      Alert.alert("Logout bem-sucedido", "Você foi deslogado com sucesso!");
    } catch (error) {
      Alert.alert("Erro ao deslogar", error.message);
    }
  };

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
