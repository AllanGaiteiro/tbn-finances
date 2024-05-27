import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { expenseRepository } from '../../repositories/ExpenseRepository';
import { transactionRepository } from '../../repositories/TransactionRepository';

export const ExpenseScrollByMonth = ({ setSelectedMonth, setSelectedYear }) => {
    const [expenseMonths, setExpenseMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = transactionRepository.observeExpenseAmountByMonth(setExpenseMonths, setLoading);

        return () => unsubscribe();
    }, []);

    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'pendente': return '#FF9800'; // Laranja para indicar pendência
            case 'paga': return '#4CAF50'; // Verde para indicar que a despesa foi paga
            case 'atrasada': return '#F44336'; // Vermelho para indicar atraso no pagamento
            default: return '#757575'; // Cinza para estados não especificados
        }
    };

    const handleMonthYear = (expense) => {
        setSelectedMonth(expense.month);
        setSelectedYear(expense.year);
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.sliderContainer} >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {expenseMonths.map((expense, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => handleMonthYear(expense)}
                        style={styles.monthItem}>
                        <Text style={styles.month}>{expense.monthId}</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Pago: </Text>
                            <Text style={[styles.monthTotal, { color: getBorderColorByStatus('paga') }]}>R$ {expense.total.toFixed(2)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Não Pago:</Text>
                            <Text style={[styles.monthTotal, { color: getBorderColorByStatus('pendente') }]}>R$ {expense.totalNotPay.toFixed(2)}</Text>
                        </View>

                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export const styles = StyleSheet.create({
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
});