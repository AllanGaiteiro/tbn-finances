import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { ExpenseItem } from './ExpenseItem';
import { Expense } from '../../entity/Expense';


export function ExpenseList({selectedMonth,selectedYear}) {
    const [expense, setExpense] = useState([new Expense()]);
    const screenHeight = Dimensions.get('window').height; // Obter a altura da tela

    useEffect(() => {
        const unsubscribe = expenseRepository.observeExpensesForSelectedMonth(setExpense,selectedMonth,selectedYear);
        return () => unsubscribe();
    }, [selectedMonth,selectedYear]);

    return <View style={{ height: screenHeight / 1.5 }}>
        <ScrollView nestedScrollEnabled={true}>
            {expense.length > 0 ? (
                expense.map((expense, index) => (
                    <ExpenseItem key={index} expense={expense} />
                ))
            ) : (
                <Text style={expensetyles.emptyMessage}>Nenhuma despesa encontrada.</Text>
            )}
        </ScrollView>
    </View>;
}

export const expensetyles = StyleSheet.create({
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575',
    },

});
