import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebaseService } from '../../settings/FirebaseService';

export const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await firebaseService.login(email, password);
            // Usuário logado com sucesso, userCredential.user contém as informações do usuário
            Alert.alert("Login bem-sucedido", "Você está logado!");
        } catch (error) {
            // Um erro aconteceu durante o login
            Alert.alert("Erro no login", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button title="Entrar" onPress={handleLogin} />
            <Button title="Não tem uma conta? Cadastre-se" onPress={() => navigation.navigate('SignUp')} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
});