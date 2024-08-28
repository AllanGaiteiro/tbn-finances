import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { TypeTransactionSlider } from './TypeTransactionSlider';
import { useTransactionFilters } from '../../../providers/TransactionFilterProvider';


export function TransactionSearch({ transactions, setFilteredTransactions }) {
    const { filters, setFilters } = useTransactionFilters(); // Obtendo os filtros do provedor

    const [typeTransaction, setTypeTransaction] = useState(null);

    useEffect(() => {
        // Aplicar filtros e ordenação quando as transações mudarem
        applyFilters();
    }, [transactions, typeTransaction]);

    const applyFilters = () => {
        let filtered = transactions;
        if (typeTransaction) {
            filtered = filtered.filter(transaction => transaction.typeTransaction === typeTransaction);
        }
        setFilteredTransactions(filtered);
    };

    return <View style={styles.filtersContainer}>
        <TextInput
            style={styles.input}
            placeholder="Filtrar por descrição..."
            value={filters.text}
            onChangeText={text => setFilters({ ...filters, text })} />
        <TypeTransactionSlider typeTransaction={typeTransaction} setTypeTransaction={setTypeTransaction} />
    </View>;
}

const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    }
});
