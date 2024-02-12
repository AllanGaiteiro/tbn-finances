import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AddIncome } from './components/AddIncome';
import { incomeStyles } from '../../styles/incomeStyles';
import { IncomeSummaryCard } from './components/IncomeSummaryCard';
import { IncomeScrollByMonth } from './components/IncomeScrollByMonth';
import { IncomeList } from './components/IncomeList';


const IncomeScreen = ({ navigation }) => {

    return (
        <ScrollView style={incomeStyles.outerContainer}>
            <View style={incomeStyles.innerContainer}>
                <IncomeSummaryCard/>
                <IncomeScrollByMonth />
                <Text style={incomeStyles.title}>Lista de Entradas</Text>
                <AddIncome />
                <IncomeList />
            </View>
        </ScrollView>

    );
};

export default IncomeScreen;



