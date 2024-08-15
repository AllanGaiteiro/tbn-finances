import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { transactionRepository } from "../../../repositories/TransactionRepository";
import { TransactionEntity } from "../../../entity/TransactionEntity";
import { ActivityIndicator } from "react-native-paper";
import { useAccount } from "../../../providers/AccountProvider";
import { useTransactionFilters } from "../../../providers/TransactionFilterProvider";
import { MaterialIcons } from "@expo/vector-icons";

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
                <View >
                    <Text style={styles.title}>Contas Atrasadas</Text>
                    <Text style={styles.message}>Você possui {transactions.length} contas pendentes.</Text>
                </View>
                <MaterialIcons name="error" size={35} color="#FF5733" />
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
        borderWidth: 1,
        flexDirection: 'row', // Alinha os itens horizontalmente
        alignItems: 'center', // Centraliza verticalmente
        justifyContent: 'space-between', // Espaço entre os itens
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