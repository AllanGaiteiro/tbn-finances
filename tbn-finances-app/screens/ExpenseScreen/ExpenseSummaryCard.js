import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { expenseRepository } from '../../repositories/ExpenseRepository';

export const ExpenseSummaryCard = () => {
    const [loading, setLoading] = useState(true);
    const [amountByMonth, setAmountByMonth] = useState(0);
    const [amountPaymentByMonth, setAmountPaymentByMonth] = useState(0);
    const [amountNotPaymentByMonth, setAmountNotPaymentByMonth] = useState(0);


    useEffect(() => {
        // Assinaturas retornarão funções para desinscrever
        const unsubAmountByMonth = expenseRepository.observeAmountByMonth(setAmountByMonth);
        const unsubAmountPaymentByMonth = expenseRepository.observeAmountPaymentByMonth(setAmountPaymentByMonth);
        const unsubAmountNotPaymentByMonth = expenseRepository.observeAmountNotPaymentByMonth(setAmountNotPaymentByMonth);

        // Quando qualquer dado é atualizado, removemos o indicador de carregamento
        const unsubscribes = [unsubAmountByMonth, unsubAmountPaymentByMonth, unsubAmountNotPaymentByMonth];
        const checkLoading = () => {
            if (unsubscribes.every((unsub) => unsub !== undefined)) {
                setLoading(false);
            }
        };

        checkLoading();

        return () => {
            unsubAmountByMonth();
            unsubAmountPaymentByMonth();
            unsubAmountNotPaymentByMonth();
        };
    }, []);

    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'pendente': return '#FF9800'; // Laranja para indicar pendência
            case 'paga': return '#4CAF50'; // Verde para indicar que a despesa foi paga
            case 'atrasada': return '#F44336'; // Vermelho para indicar atraso no pagamento
            default: return '#757575'; // Cinza para estados não especificados
        }
    };


    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo de Saidas do Mes</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Valor Total:</Text>
                <Text style={styles.totalValue}>R$ {amountByMonth.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Valor Pago:</Text>
                <Text style={[styles.totalValue, { color: getBorderColorByStatus('paga') }]}>R$ {amountPaymentByMonth.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Falta Pagar:</Text>
                <Text style={[styles.totalValue, { color: getBorderColorByStatus('pendente') }]}>R$ {amountNotPaymentByMonth.toFixed(2)}</Text>
            </View>


        </View>
    );
};


export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF', // Fundo branco para os cartões
        borderRadius: 8,
        padding: 15,
        marginVertical: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        marginBottom: 10,
        shadowColor: '#000', // Sombra para dar um efeito "elevado"
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Necessário para sombra no Android
        justifyContent: 'space-between', // Espaço entre os itens
        alignItems: 'center', // Centraliza os itens verticalmente
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F44336',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F44336',
    },
    pendingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    loader: {
        marginTop: 20,
    },
});
