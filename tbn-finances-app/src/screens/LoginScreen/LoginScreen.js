import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userAuthService } from '../../services/UserAuthService';

export const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await userAuthService.login(email, password);
            // Usuário logado com sucesso, userCredential.user contém as informações do usuário
            Alert.alert("Login bem-sucedido", "Você está logado!");
        } catch (error) {
            // Um erro aconteceu durante o login
            Alert.alert("Erro no login", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>TBN Finances</Text>
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
            <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
                Não tem uma conta? Cadastre-se
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    signupLink: {
        marginTop: 15,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
