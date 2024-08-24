import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SortButton } from './button/SortButton';
import { useTransactionFilters } from '../../../providers/TransactionFilterProvider';


export function TransactionListSort() {
    const { filters, setFilters } = useTransactionFilters(); // Obtendo os filtros do provedor

    const ParamsOrder = [
        { name: 'Valor', id: 'amount' },
        { name: 'Descrição', id: 'description' },
        { name: 'Data', id: 'transactionDate' },
        { name: 'Status', id: 'status' },
    ];

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
    };

    return <View style={styles.sortButtonsContainer}>
        {ParamsOrder.map(p => <SortButton
            key={p.id}
            label={p.name}
            onPress={() => handleSortBy(p.id)}
            active={filters.sortBy === p.id}
            sortOrder={filters.sortOrder} />
        )}
    </View>;
}

const styles = StyleSheet.create({
    sortButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    }
});
