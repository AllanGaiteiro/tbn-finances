import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { firebaseService } from '../../settings/FirebaseService';

export const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log('SignUpScreen')

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
            <Button title="Já tem uma conta? Entre aqui" onPress={() => navigation.navigate('Login')} />

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