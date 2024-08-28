import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Dimensions, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { SpreadsheetGenerator } from './SpreadsheetGenerator';
import { useAccount } from '../../../providers/AccountProvider';
import { useTransactionFilters } from '../../../providers/TransactionFilterProvider';
import { TransactionListTitle } from './titles/TransactionListTitle';
import { TransactionSearch } from './TransactionSearch';
import { TransactionListSort } from './TransactionListSort';
import { TransactionList } from './TransactionList';
import { TransactionPieChart } from './TransactionPieChart';

export function TransactionSectionList() {
    const { account } = useAccount();
    const { filters, setFilters } = useTransactionFilters(); // Obtendo os filtros do provedor
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDash, setShowDash] = useState(false);

    const animatedValue = new Animated.Value(1);

    useEffect(() => {
        if (!account) return;
        const combinedSubscription = transactionRepository(account.id).observeTransactionList(setTransactions, setLoading, filters);
        return () => combinedSubscription.unsubscribe();
    }, [filters, account]);

    const getPieDataByTypeTransaction = () => {
        const incomeAmount = transactions
            .filter(t => t.typeTransaction === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseAmount = transactions
            .filter(t => t.typeTransaction === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return [
            { name: 'Income', count: Number(incomeAmount?.toFixed(2)), color: '#4CAF50' },
            { name: 'Expense', count: Number(expenseAmount?.toFixed(2)), color: '#F44336' },
        ];
    };

    const getPieDataForIncomeByType = () => {
        const incomeTransactions = transactions.filter(t => t.typeTransaction === 'income');
        const incomeTypeCounts = incomeTransactions.reduce((acc, curr) => {
            const key = typeof curr?.type === 'string' ? curr.type : curr.type?.label;
            acc[key] = (acc[key] || 0) + curr.amount;
            return acc;
        }, {});
        return Object.keys(incomeTypeCounts).map(key => ({
            name: key,
            count: Number(incomeTypeCounts[key]?.toFixed(2)),
            color: getRandomColor(), // You can create a function to generate random colors
        }));
    };

    const getPieDataForExpenseByType = () => {
        const expenseTransactions = transactions.filter(t => t.typeTransaction === 'expense');
        const expenseTypeCounts = expenseTransactions.reduce((acc, curr) => {
            const key = typeof curr?.type === 'string' ? curr.type : curr.type?.label;
            acc[key] = (acc[key] || 0) + curr.amount;
            return acc;
        }, {});
        return Object.keys(expenseTypeCounts).map(key => ({
            name: key,
            count: Number(expenseTypeCounts[key]?.toFixed(2)),
            color: getRandomColor(), // You can create a function to generate random colors
        }));
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => setShowDash(!showDash));
    };

    if (loading) {
        return <ActivityIndicator size="large" />
    }

    return (
        <View style={styles.container}>
            <TransactionSearch transactions={transactions} setFilteredTransactions={setFilteredTransactions} />

            <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
                <TransactionListTitle />
                <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.flexEnd}>
                    <Animated.View style={[
                        styles.button,
                        {
                            transform: [{ scale: animatedValue }],
                            backgroundColor: showDash ? '#2196F3' : 'transparent',
                            borderWidth: showDash ? 0 : 2,
                            borderColor: '#2196F3',
                        }
                    ]}>
                        <Text style={[
                            styles.buttonText,
                            { color: showDash ? '#FFF' : '#2196F3' }
                        ]}>
                            Dash
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            </ScrollView>
            <View >
                {!showDash && <SpreadsheetGenerator transactions={filteredTransactions} />}
                {!showDash && <TransactionListSort />}
                {!showDash && <TransactionList filteredTransactions={filteredTransactions} />}
                {showDash &&
                    <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.scrollViewContent} >
                        <TransactionPieChart title={'Receitas & Despesas'} data={getPieDataByTypeTransaction()} />
                        <TransactionPieChart title={'Receitas / Tipo'} data={getPieDataForIncomeByType()} />
                        <TransactionPieChart title={'Despesas / Tipo'} data={getPieDataForExpenseByType()} />
                    </ScrollView>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        marginBottom: 10
    },
    chartContainer: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingVertical: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    chartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    flexEnd: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        paddingLeft: 10,
        paddingTop: 0,
        marginRight: 10,
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});