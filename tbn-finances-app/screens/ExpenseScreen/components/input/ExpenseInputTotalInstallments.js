import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export function ExpenseInputTotalInstallments({ expense, setExpense }) {
    const handleInputChange = (name, value) => {

        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return expense?.type === 'parcela' && <View>
        <Text>Numero de Parcelas:</Text>
        <TextInput
            style={styles.input}
            placeholder="Digite o numero de parcelas"
            value={String(expense.totalIonstallments || 1)}
            onChangeText={(text) => handleInputChange('totalInstallments', parseInt(text))}
            keyboardType="numeric" />
    </View>;
}


const styles = StyleSheet.create({
    input: {
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
})