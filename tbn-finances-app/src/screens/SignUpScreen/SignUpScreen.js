import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { firebaseService } from '../../settings/FirebaseService';

export const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        firebaseService.signUp(email, password)
            .then(() => {
                Alert.alert("Usuário criado com sucesso!");
            })
            .catch(error => {
                Alert.alert("Erro ao criar usuário:", error.message);
            });
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
            <Button title="Cadastrar" onPress={handleSignUp} />
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            á tem uma conta? Entre aqui
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
    loginLink: {
        marginTop: 15,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
