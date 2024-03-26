import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AddExpense } from './components/AddExpense';
import { ExpenseList } from './ExpenseList';
import { ExpenseSummaryCard } from './ExpenseSummaryCard';
import { ExpenseScrollByMonth } from './ExpenseScrollByMonth';

export const ExpenseScreen = ({ navigation }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    return (
        <ScrollView style={style.outerContainer}>
            <View style={style.innerContainer}>
                <ExpenseSummaryCard />
                <ExpenseScrollByMonth setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} />
                <Text style={style.title}>Lista de Saida</Text>
                <AddExpense />
                <ExpenseList selectedMonth={selectedMonth} selectedYear={selectedYear} />
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

