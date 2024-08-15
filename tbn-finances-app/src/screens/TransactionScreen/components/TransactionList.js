import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TextInput, Text, ActivityIndicator } from 'react-native';
import { ExpenseItem } from './ExpenseItem';
import { IncomeItem } from './IncomeItem';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { SortButton } from './button/SortButton';
import { SpreadsheetGenerator } from './SpreadsheetGenerator';
import { TypeTransactionSlider } from './TypeTransactionSlider';
import { useAccount } from '../../../providers/AccountProvider';
import { useTransactionFilters } from '../../../providers/TransactionFilterProvider';

export function TransactionList() {
    const { account } = useAccount();
    const { filters, setFilters } = useTransactionFilters(); // Obtendo os filtros do provedor

    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [typeTransaction, setTypeTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        if (!account) return;
        const combinedSubscription = transactionRepository(account).observeTransactionList(setTransactions, setLoading, filters);
        return () => combinedSubscription.unsubscribe();
    }, [filters, account]);

    useEffect(() => {
        // Aplicar filtros e ordenação quando as transações mudarem
        applyFilters();
    }, [transactions, filterText, typeTransaction]);

    const applyFilters = () => {
        let filtered = transactions;
        if (filterText.trim() !== '') {
            filtered = filtered.filter(transaction => transaction.description.toLowerCase().includes(filterText.trim().toLowerCase()));
        }
        if (typeTransaction) {
            filtered = filtered.filter(transaction => transaction.typeTransaction === typeTransaction);
        }
        setFilteredTransactions(filtered);
    };

    const handleSortBy = (selectedSortBy) => {
        if (selectedSortBy === filters.sortBy) {
            toggleSortOrder();
        } else {
            setFilters({
                ...filters,
                sortBy: selectedSortBy,
                sortOrder: 'asc',
            });
        }
    };

    const toggleSortOrder = () => {
        setFilters({
            ...filters,
            sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
        });
        applyFilters();
    };

    const ParamsOrder = [
        { name: 'Valor', id: 'amount' },
        { name: 'Descrição', id: 'description' },
        { name: 'Data', id: 'transactionDate' },
        { name: 'Status', id: 'status' },
    ];

    return (
        <View style={{ height: screenHeight / 1.5 }}>
            <View style={styles.filtersContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Filtrar por descrição..."
                    value={filterText}
                    onChangeText={text => setFilterText(text)}
                />
                <SpreadsheetGenerator transactions={filteredTransactions} />
                <TypeTransactionSlider typeTransaction={typeTransaction} setTypeTransaction={setTypeTransaction} />
                <View style={styles.sortButtonsContainer}>
                    {ParamsOrder.map(p =>
                        <SortButton
                            key={p.id}
                            label={p.name}
                            onPress={() => handleSortBy(p.id)}
                            active={filters.sortBy === p.id}
                            sortOrder={filters.sortOrder}
                        />
                    )}
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <ScrollView nestedScrollEnabled={true}>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            transaction.typeTransaction === 'expense' ?
                                <ExpenseItem key={index} expense={transaction} /> :
                                <IncomeItem key={index} income={transaction} />
                        ))
                    ) : (
                        <Text style={styles.emptyMessage}>Nenhuma valor encontrada.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'column',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    sortButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575',
    },
});



