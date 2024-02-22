import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export function IncomeButtonSave({ formValidate, save }) {

    return <TouchableOpacity disabled={formValidate()} style={formValidate() ? styles.saveButtonDisabled : styles.button} onPress={save}>
        <Text style={formValidate() ? styles.saveButtonTextDisabled : styles.saveButtonText}>Salvar</Text>
    </TouchableOpacity>;
}

export const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonDisabled: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        paddingHorizontal: 40,
    },
    saveButtonTextDisabled: {
        color: '#000000',
        fontSize: 16,
        paddingHorizontal: 40,
    },
});