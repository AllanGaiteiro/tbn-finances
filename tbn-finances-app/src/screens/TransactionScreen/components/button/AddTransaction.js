import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Expense } from '../../../../entity/Expense';
import { FormExpense } from '../FormExpense';
import { FormIncome } from '../FormIncome';

export function AddTransaction() {
    const [isFormIncomeVisible, setIsFormIncomeVisible] = useState(false);
    const [isFormExpenseVisible, setIsFormExpenseVisible] = useState(false);


    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {!isFormIncomeVisible && !isFormExpenseVisible && (
                    <TouchableOpacity
                        style={[styles.button, styles.incomeButton]}
                        onPress={() => setIsFormIncomeVisible(!isFormIncomeVisible)}>
                        <Text style={styles.buttonText}>{isFormIncomeVisible ? 'Fechar' : 'Receita'}</Text>
                    </TouchableOpacity>
                )}
                {!isFormIncomeVisible && !isFormExpenseVisible && (
                    <TouchableOpacity
                        style={[styles.button, styles.expenseButton]}
                        onPress={() => setIsFormExpenseVisible(!isFormExpenseVisible)}>
                        <Text style={styles.buttonText}>{isFormExpenseVisible ? 'Fechar' : 'Despesa'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isFormIncomeVisible && !isFormExpenseVisible &&
                <FormIncome isFormVisible={isFormIncomeVisible} setIsFormVisible={setIsFormIncomeVisible} />
            }
            {isFormExpenseVisible && !isFormIncomeVisible &&
                <FormExpense expense={new Expense()} isFormVisible={isFormExpenseVisible} setIsFormVisible={setIsFormExpenseVisible} />
            }
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flex: 1, // Para que ambos os botões ocupem a mesma largura
    },
    incomeButton: {
        backgroundColor: '#4CAF50',
        marginRight: 5, // Espaçamento entre os botões
    },
    expenseButton: {
        backgroundColor: '#F44336',
        marginLeft: 5, // Espaçamento entre os botões
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
