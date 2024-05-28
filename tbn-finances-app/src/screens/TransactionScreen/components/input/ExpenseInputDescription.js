import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export function ExpenseInputDescription({ isVisible = true, expense, setExpense }) {

    const handleInputChange = (name, value) => {
        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return isVisible &&
        <View>
            <Text>Descrição:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a descrição..."
                value={expense.description}
                onChangeText={(text) => handleInputChange('description', text)} />
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