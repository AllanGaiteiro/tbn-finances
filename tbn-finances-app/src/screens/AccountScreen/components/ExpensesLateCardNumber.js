import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { transactionRepository } from '../../../repositories/TransactionRepository';


export const ExpensesLateCardNumber = ({ accountData }) => {
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accountData) return;
        const transactionSubscription = transactionRepository(accountData.id).observerTransactionLate(setTransactions, setLoading, { status: 'atrasada' });
        const unsubscribes = [transactionSubscription];
        const checkLoading = () => {
            if (unsubscribes.every((unsub) => unsub !== undefined)) {
                setLoading(false);
            }
        };

        checkLoading();

        return () => {
            transactionSubscription.unsubscribe();
        };
    }, [accountData]);

    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }
    return (
        !loading && transactions.length > 0 ?
            <TouchableOpacity style={styles.stylesPendentes} >
                <Text style={styles.pendingText}>{transactions.length} contas</Text>
            </TouchableOpacity>
            : null
    );
};


const styles = StyleSheet.create({
    stylesPendentes: {
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF5733',
        margin: 'auto',
    },
    pendingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF5733',
    },
    loader: {
        marginTop: 20,
    },
})