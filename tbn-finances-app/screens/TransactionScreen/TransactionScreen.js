import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TransactionList } from './TransactionList';
import { SummaryCard } from './components/SummaryCard';
import { ScrollByMonth } from './components/ScrollByMonth';
import { AddTransaction } from './components/AddTransaction';

export const TransactionScreen = ({ navigation }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    return (
        <ScrollView style={style.outerContainer}>
            <View style={style.innerContainer}>
                <SummaryCard />
                <ScrollByMonth setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} />
                <Text style={style.title}>Lista de Transações</Text>
                <AddTransaction />

                <TransactionList selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </View>
        </ScrollView>

    );
};

export const style = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    innerContainer: {
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Um fundo claro
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
});

