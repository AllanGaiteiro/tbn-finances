import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { AmountByMonth } from '../../../entity/AmountByMonth';
import { useAccount } from '../../../providers/AccountProvider';

export const SummaryCard = () => {
    const [loading, setLoading] = useState(true);
    const [amountByMonth, setAmountByMonth] = useState(new AmountByMonth());
    const { account } = useAccount();

    useEffect(() => {
        if (!account) return;
        // Assinaturas retornarão funções para desinscrever
        const unsubAmountByMonth = transactionRepository(account).observeTransactionByMonth(setAmountByMonth, setLoading, 'amount');

        // Quando qualquer dado é atualizado, removemos o indicador de carregamento
        const unsubscribes = [unsubAmountByMonth];
        const checkLoading = () => {
            if (unsubscribes.every((unsub) => unsub !== undefined)) {
                setLoading(false);
            }
        };

        checkLoading();

        return () => {
            unsubAmountByMonth.unsubscribe();
        };
    }, [account]);

    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'recebida': return '#4CAF50'; // Verde para indicar que a despesa foi paga
            case 'em_progresso': return '#2196F3'; // Azul
            case 'gasto': return '#F44336'; // Vermelho para indicar atraso no pagamento
            default: return '#757575'; // Cinza para estados não especificados
        }
    };


    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo do Mês</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Recebido:</Text>
                <Text style={[styles.primaryValue, { color: getBorderColorByStatus('recebida') }]}>{amountByMonth.received?.toFixed(2)}</Text>
            </View>
            <View style={styles.secondaryRow}>
                <Text style={styles.secondaryLabel}>A Receber:</Text>
                <Text style={[styles.secondaryValue, { color: getBorderColorByStatus('em_progresso') }]}>{amountByMonth.notReceived?.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Pago:</Text>
                <Text style={[styles.primaryValue, { color: getBorderColorByStatus('gasto') }]}>{amountByMonth?.pay?.toFixed(2)}</Text>
            </View>
            <View style={styles.secondaryRow}>
                <Text style={styles.secondaryLabel}>A Pagar:</Text>
                <Text style={[styles.secondaryValue, { color: getBorderColorByStatus('gasto') }]}>{amountByMonth?.notPay?.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Balanço Geral:</Text>
                <Text style={[styles.primaryValue, { color: getBorderColorByStatus(amountByMonth.total > 0 ? 'recebida' : 'gasto') }]}>{amountByMonth.total?.toFixed(2)}</Text>
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
        justifyContent: 'center',
    },
    secondaryRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 2,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)', // Preto transparente (ajuste a transparência conforme necessário)

    },
    label: {
        fontSize: 26,
        color: '#666',
        textAlign: 'left',
        width: '60%',
    },
    secondaryLabel: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        width: '60%'
    },
    primaryValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F44336',
        width: '40%'
    },
    secondaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F44336',
        width: '40%'

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
