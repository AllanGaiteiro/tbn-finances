import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AddIncome } from './components/AddIncome';
import { IncomeSummaryCard } from './components/IncomeSummaryCard';
import { IncomeScrollByMonth } from './components/IncomeScrollByMonth';
import { IncomeList } from './components/IncomeList';


const IncomeScreen = ({ navigation }) => {

    return (
        <ScrollView style={style.outerContainer}>
            <View style={style.innerContainer}>
                <IncomeSummaryCard/>
                <IncomeScrollByMonth />
                <Text style={style.title}>Lista de Entradas</Text>
                <AddIncome />
                <IncomeList />
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
    }
})

export default IncomeScreen;



