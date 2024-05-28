import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TextInput, Text, ActivityIndicator } from 'react-native';
import { ExpenseItem } from './components/ExpenseItem';
import { IncomeItem } from './components/IncomeItem';
import { TransactionEntity } from '../../entity/TransactionEntity';
import { transactionRepository } from '../../repositories/TransactionRepository';
import { SortButton } from './SortButton';
import { SpreadsheetGenerator } from './SpreadsheetGenerator';
import { TypeTransactionSlider } from './components/TypeTransactionSlider';
import { useUser } from '../../providers/UserProvider';
export function TransactionList({ selectedMonth, selectedYear }) {
    const { userId } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [typeTransaction, setTypeTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        const unsubscribe = transactionRepository(userId).observeTransactionForSelectedMonth(setTransactions,setLoading, { selectedMonth, selectedYear, sortOrder, sortBy });
        return () => unsubscribe();
    }, [selectedMonth, selectedYear, sortBy, sortOrder, userId]);

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
        if (selectedSortBy === sortBy) {
            toggleSortOrder();
        } else {
            setSortBy(selectedSortBy);
            setSortOrder('asc');
        }
    };

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        applyFilters();
    };

    const ParamsOrder = [
        { name: 'Valor', id: 'amount' },
        { name: 'Descrição', id: 'description' },
        { name: 'Data', id: 'dueDate' },
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
                            active={sortBy === p.id}
                            sortOrder={sortOrder}
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



