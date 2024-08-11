import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { useAccount } from '../../../providers/AccountProvider';

export const ScrollByMonth = ({ setSelectedMonth, setSelectedYear }) => {
    const [transactionMonths, setTransactionMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAccount();

    useEffect(() => {
        if (!account) return;
        const unsubscribe = transactionRepository(account).observeTransactionAmountByMonth(setTransactionMonths, setLoading);

        return () => unsubscribe();
    }, [account]);

    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'recebido': return '#4CAF50'; // Verde para indicar que a despesa foi paga
            case 'gasto': return '#F44336'; // Vermelho para indicar atraso no pagamento
            default: return '#757575'; // Cinza para estados não especificados
        }
    };

    const handleMonthYear = (transactionMonth) => {
        setSelectedMonth(transactionMonth.month);
        setSelectedYear(transactionMonth.year);
    }

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.sliderContainer} >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {transactionMonths.map((transactionMonth, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => handleMonthYear(transactionMonth)}
                        style={styles.monthItem}>
                        <Text style={styles.month}>{transactionMonth.monthId}</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Receita: </Text>
                            <Text style={[styles.monthTotal, { color: getBorderColorByStatus('recebido') }]}>R$ {transactionMonth?.incomeMonth > 0 ? transactionMonth.incomeMonth?.toFixed(2) : '0,00'}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Despesas: </Text>
                            <Text style={[styles.monthTotal, { color: getBorderColorByStatus('gasto') }]}>R$ {transactionMonth?.expenseMonth > 0 ? transactionMonth.expenseMonth?.toFixed(2) : '0,00'}</Text>
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