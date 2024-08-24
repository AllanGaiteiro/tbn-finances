
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { ExpenseItem } from './ExpenseItem';
import { IncomeItem } from './IncomeItem';

export function TransactionList({ filteredTransactions }) {
    const screenHeight = Dimensions.get('window').height;

    return <ScrollView nestedScrollEnabled={true} style={{ height: screenHeight / 1.4 }}>
        {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
                transaction.typeTransaction === 'expense' ?
                    <ExpenseItem key={index} expense={transaction} /> :
                    <IncomeItem key={index} income={transaction} />
            ))
        ) : (
            <Text style={styles.emptyMessage}>Nenhuma valor encontrada.</Text>
        )}
    </ScrollView>;
}

const styles = StyleSheet.create({
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575',
    },
});
