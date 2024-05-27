import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Income } from '../../../entity/Income';
import { IncomeItem } from '../../TransactionScreen/components/IncomeItem';
import { incomeRepository } from '../../../repositories/IncomeRepository';
import { transactionRepository } from '../../../repositories/TransactionRepository';

export function IncomeList({ selectedMonth, selectedYear }) {
    const [incomes, setIncomes] = useState([new Income()]);
    const screenHeight = Dimensions.get('window').height; // Obter a altura da tela

    useEffect(() => {
        const unsubscribe = transactionRepository.observeTransactionForSelectedMonth(setIncomes, selectedMonth, selectedYear);
        return () => unsubscribe();
    }, [selectedMonth,selectedYear]);

    return <View style={{ height: screenHeight / 1.5 }}>
        <ScrollView nestedScrollEnabled={true}>
            {incomes.length > 0 ? (
                incomes.map((income, index) => (
                    <IncomeItem key={index} income={income} />
                ))
            ) : (
                <Text style={incomeStyles.emptyMessage}>Nenhuma renda encontrada.</Text>
            )}
        </ScrollView>
    </View>;
}

const incomeStyles = StyleSheet.create({
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575',
    },

});