import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormExpense } from './FormExpense';
import { Expense } from '../../../entity/Expense';

export function AddExpense() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <View style={styles.container}>
            {!isFormVisible && <TouchableOpacity
                style={styles.button}
                onPress={() => setIsFormVisible(!isFormVisible)}>
                <Text style={styles.buttonText}>{isFormVisible ? 'Fechar' : 'Adicionar Despesa'}</Text>
            </TouchableOpacity>}

            {isFormVisible &&
                <FormExpense expense={new Expense()} isFormVisible={isFormVisible} setIsFormVisible={setIsFormVisible} />
            }
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

