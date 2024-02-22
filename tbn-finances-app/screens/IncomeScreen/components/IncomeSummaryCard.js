import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { incomeRepository } from '../../../repositories/IncomeRepository';

export const IncomeSummaryCard = () => {
    const [loading, setLoading] = useState(true);
    const [allReceived, setAllReceived] = useState(0);
    const [allIncomes, setAllIncomes] = useState(0);
    const [allToReceive, setAllToReceive] = useState(0);

    useEffect(() => {
        // Assinaturas retornarão funções para desinscrever
        const unsubAllReceived = incomeRepository.observeReceivedThisMonth(setAllReceived);
        const unsubAllToReceive = incomeRepository.observeToReceiveThisMonth(setAllToReceive);
        const unsubAllIncomes = incomeRepository.observeToReceivedAllThisMonth(setAllIncomes);

        // Quando qualquer dado é atualizado, removemos o indicador de carregamento
        const unsubscribes = [unsubAllReceived, unsubAllIncomes, unsubAllToReceive];
        const checkLoading = () => {
            if (unsubscribes.every((unsub) => unsub !== undefined)) {
                setLoading(false);
            }
        };

        checkLoading();

        // Limpeza: Desinscrever de todas as observações quando o componente é desmontado
        return () => {
            unsubAllReceived();
            unsubAllIncomes();
            unsubAllToReceive();
        };
    }, []);

    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo de Entradas Do mes</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Total Recebido:</Text>
                <Text style={styles.totalValue}>R$ {allReceived.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Total a Receber:</Text>
                <Text style={styles.pendingValue}>R$ {allToReceive.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Total neste Mes:</Text>
                <Text style={styles.value}>R$ {allIncomes.toFixed(2)}</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
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
        color: '#4CAF50',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
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
