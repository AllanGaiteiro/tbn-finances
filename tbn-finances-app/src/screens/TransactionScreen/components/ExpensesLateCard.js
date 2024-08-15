import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { transactionRepository } from "../../../repositories/TransactionRepository";
import { TransactionEntity } from "../../../entity/TransactionEntity";
import { ActivityIndicator } from "react-native-paper";
import { useAccount } from "../../../providers/AccountProvider";
import { useTransactionFilters } from "../../../providers/TransactionFilterProvider";

export const ExpensesLateCard = () => {
    const { account } = useAccount();
    const [transactions, setTransactions] = useState([new TransactionEntity()]);
    const { filters, setFilters } = useTransactionFilters(); // Obtendo os filtros do provedor

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account) return;
        const transactionSubscription = transactionRepository(account).observerTransactionLate(setTransactions, setLoading, { ...filters, status: 'atrasada' });
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
    }, [account]);

    const getExpenseLate = () => {
        setFilters({
            ...filters,
            status: 'atrasada',
        });
    };

    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }
    return (
        !loading && transactions.length > 0 ?
            <TouchableOpacity style={styles.container}
                onPress={() => getExpenseLate()}>
                <Text style={styles.title}>Contas Atrasadas</Text>
                <Text style={styles.message}>Você possui {transactions.length} contas pendentes.</Text>
            </TouchableOpacity> : null
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        margin: 16,
        borderColor: '#FF5733',
        borderWidth: 1
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF5733',
    },
    message: {
        fontSize: 14,
        color: '#FF5733',
    },
    loader: {
        marginTop: 20,
    },
});