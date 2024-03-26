import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AddIncome } from './components/AddIncome';
import { IncomeSummaryCard } from './components/IncomeSummaryCard';
import { IncomeScrollByMonth } from './components/IncomeScrollByMonth';
import { IncomeList } from './components/IncomeList';


const IncomeScreen = ({ navigation }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    return (
        <ScrollView style={style.outerContainer}>
            <View style={style.innerContainer}>
                <IncomeSummaryCard/>
                <IncomeScrollByMonth setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} />
                <AddIncome />
                <Text style={style.title}>Lista de Entradas</Text>

                <IncomeList  selectedMonth={selectedMonth} selectedYear={selectedYear} />
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
})

export default IncomeScreen;



