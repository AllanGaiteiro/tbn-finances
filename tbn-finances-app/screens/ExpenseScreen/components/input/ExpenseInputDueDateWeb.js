import React from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';


export function ExpenseInputDueDateWeb({ expense, setExpense, isVisible }) {
    const handleInputChange = (name, value) => {
        setExpense(prevExpense => ({
            ...prevExpense,
            [name]: value
        }));

    };

    return Platform.OS === 'web' && isVisible && <View>
        <Text>Data de Vencimento: </Text>
        <input
            type="date"
            value={expense?.dueDate ? expense.dueDate.toISOString().substring(0, 10) : ''}
            onChange={(event) => handleInputChange('dueDate', new Date(event.target.value))}
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
