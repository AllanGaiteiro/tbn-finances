import React from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { incomeRepository } from '../../../../repositories/IncomeRepository';

export function IncomeButtonCancel({ isVisible, income, setIsFormVisible }) {
    const handleCancel = async () => {
        try {
            await incomeRepository.cancelIncome(income);
            setIsFormVisible(false); // Esconde o formulário
            Alert.alert("Cancelado", "A Renda Foi Cancelada.");
        } catch (error) {
            console.error("Erro ao cancelar documento: ", error);
            Alert.alert("Erro", "Não foi possível cancelar a renda.");
        }
    };
    return isVisible &&
        <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar Essa Oferta</Text>
        </TouchableOpacity>;
}


export const styles = StyleSheet.create({
    buttonText: {
        color: '#F44336',
        fontSize: 16,

    },
    cancelButton: {
        backgroundColor: '#FFFFFF', // Vermelho para o botão cancelar
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F44336',
    }
});