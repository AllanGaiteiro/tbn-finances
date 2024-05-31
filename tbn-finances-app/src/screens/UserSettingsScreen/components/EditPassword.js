// EditEmail.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { handleFirebaseError } from '../../../settings/errorHandling'; // Importa a função de tratamento de erros
import { userAuthService } from '../../../services/UserAuthService';


export const EditPassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [expandPassword, setExpandPassword] = useState(false);

    const handleChangePassword = () => userAuthService.changePassword(currentPassword, newPassword);

    return (
        <TouchableOpacity onPress={() => setExpandPassword(!expandPassword)}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Alteração de Senha</Text>
                {expandPassword && (
                    <View>
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