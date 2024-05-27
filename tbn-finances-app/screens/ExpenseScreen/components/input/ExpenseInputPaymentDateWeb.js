import React from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';


export function ExpenseInputPaymentDateWeb({ expense, setExpense, isVisible }) {
    const handleInputChange = (name, value) => {
        if (name === 'transactionDate' && value) {
            handleInputChange('status', 'pago');
        }

        setExpense(prevExpense => ({
            ...prevExpense,
            [name]: value
        }));

    };

    return Platform.OS === 'web' && isVisible && <View>
        <Text>Pago em: </Text>
        <input
            type="date"
            value={expense?.transactionDate ? expense.transactionDate.toISOString().substring(0, 10) : ''}
            onChange={(event) => handleInputChange('transactionDate', new Date(event.target.value))}
            style={{ ...styles.input, cursor: 'pointer' }} // Estilo adicional para web
        />

    </View>;
}

export const styles = StyleSheet.create({
    input: {
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});