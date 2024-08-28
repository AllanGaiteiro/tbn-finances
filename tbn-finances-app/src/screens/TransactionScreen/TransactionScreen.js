import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { TransactionSectionList } from './components/TransactionSectionList';
import { TransactionSectionMonth } from './components/TransactionSectionMonth';
import { AddTransaction } from './components/button/AddTransaction';
import { useAccount } from '../../providers/AccountProvider';
import { ExpensesLateCard } from './components/ExpensesLateCard';
import { TransactionFilterProvider } from '../../providers/TransactionFilterProvider';
import { AddTransactionTitle } from './components/titles/AddTransactionTitle';

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
                    {/* criar componente de valor atual */}

                    <TransactionSectionMonth />
                    <ExpensesLateCard />

                    <AddTransactionTitle />
                    <AddTransaction />

                    <TransactionSectionList />
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
        margin: 0,
        padding: 10,
    },
});
