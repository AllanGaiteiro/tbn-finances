import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { incomeRepository } from '../../../repositories/IncomeRepository';
import { transactionRepository } from '../../../repositories/TransactionRepository';

export const IncomeScrollByMonth = ({ setSelectedMonth, setSelectedYear }) => {
    const [incomeMonths, setIncomeMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = transactionRepository.observeIncomeAmountByMonth(setIncomeMonths, setLoading);
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    const handleMonthYear = (income) => {
        setSelectedMonth(income.month);
        setSelectedYear(income.year);
    }

    return (
        <View style={styles.sliderContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {incomeMonths.map((income, index) => (
                    <TouchableOpacity key={index} style={styles.monthItem}
                    onPress={() => handleMonthYear(income)}
                    >
                        <Text style={styles.month}>{income.monthId}</Text>
                        <Text style={styles.monthTotal}>R$ {income.total.toFixed(2)}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        paddingLeft: 16, // Adiciona espaço à esquerda para começar
        paddingTop: 20,
    },
    monthItem: {
        width: 200, // Aumenta a largura do card para dar mais espaço
        marginRight: 16, // Adiciona espaço entre os cards
        backgroundColor: '#FFF',
        borderRadius: 10, // Borda mais arredondada
        padding: 20,
        justifyContent: 'center', // Centraliza o conteúdo verticalmente
        shadowColor: '#000', // Sombra para dar um efeito "elevado"
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Necessário para sombra no Android
    },
    month: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5, // Espaço entre o mês e o total
    },
    monthTotal: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4CAF50', // Verde para valor total
    },
});
