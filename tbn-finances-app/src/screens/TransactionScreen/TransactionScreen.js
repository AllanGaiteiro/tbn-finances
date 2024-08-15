import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { TransactionList } from './components/TransactionList';
import { SummaryCard } from './components/SummaryCard';
import { ScrollByMonth } from './components/ScrollByMonth';
import { AddTransaction } from './components/button/AddTransaction';
import { useAccount } from '../../providers/AccountProvider';
import { ExpensesLateCard } from './components/ExpensesLateCard';
import { TransactionFilterProvider, useTransactionFilters } from '../../providers/TransactionFilterProvider';


export const TransactionScreen = ({ navigation }) => {
    const { account } = useAccount();

    useEffect(() => {
        verifyAccounts();
        const unsubscribe = navigation.addListener('focus', () => {
            verifyAccounts();
        });

        return unsubscribe;
    }, [navigation]);

    const verifyAccounts = () => {
        if (!account) {
            Alert.alert(
                "Atenção",
                "Você precisa cadastrar uma Organização ou Evento.",
                [
                    { text: "OK", onPress: () => navigation.navigate("Contas") } // Substitua "NomeDaSuaTelaDeContas" pelo nome correto da sua tela de contas
                ],
                { cancelable: false }
            );
        }

    };

    return (
        <ScrollView style={style.outerContainer}>
            <TransactionFilterProvider>
                <View style={style.innerContainer}>
                    <SummaryCard />
                    <ExpensesLateCard />
                    <ScrollByMonth />
                    <Text style={style.title}>Lista de Transações</Text>
                    <AddTransaction />
                    <TransactionList />
                </View>
            </TransactionFilterProvider>
        </ScrollView>
    );
};

const style = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    innerContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
});
