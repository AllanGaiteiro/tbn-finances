import React from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { transactionRepository } from '../../../../repositories/TransactionRepository';
import { useAccount } from '../../../../providers/AccountProvider';

export function IncomeButtonCancel({ isVisible, income, setIsFormVisible }) {
    const { account } = useAccount()
    const handleCancel = async () => {
        try {
            await transactionRepository(account.id).income.cancelIncome(income);
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
            <Text style={styles.buttonText}>Cancelar</Text>
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