import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormIncome } from './FormIncome';

export function IncomeItem({ income }) {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const formatDate = (date) => {
        if (!date) return ' - '; // Retorna um placeholder se a data não existir

        // Formata a data como dia/mês/ano
        const day = date.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna o mês de 0-11

        return `${day}/${month}`;
    };

    // Define a função para determinar a cor da borda com base no status
    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'recebido': return '#4CAF50'; // Verde
            case 'em_progresso': return '#2196F3'; // Azul
            case 'cancelado': return '#F44336'; // Vermelho
            default: return '#000000'; // Preto para 'retornado' e outros estados não especificados
        }
    };

    // Aplica a cor da borda dinamicamente com base no status
    const dynamicBorderStyle = {
        borderLeftColor: getBorderColorByStatus(income?.status),
    };

    const dynamicAmountColorStyle = {
        color: getBorderColorByStatus(income?.status),
    };

    return (
        <View key={income.id}>
            {!isFormVisible && <TouchableOpacity key={income.id} style={[styles.incomeItem, dynamicBorderStyle]}
                onPress={() => setIsFormVisible(!isFormVisible)}>
                <Text style={[styles.incomeAmount, dynamicAmountColorStyle]}>{income.amount}</Text>
                <Text style={styles.incomeType}>{income.description}</Text>
                <Text style={styles.incomeDate}>{formatDate(income.transactionDate)}</Text>
                <Text style={[styles.incomeType,dynamicAmountColorStyle]}>{income.status}</Text>
            </TouchableOpacity>}
            {isFormVisible && <FormIncome income={income} setIsFormVisible={setIsFormVisible} />}
        </View>

    );
}

const styles = StyleSheet.create({
    incomeItem: {
        backgroundColor: '#FFFFFF', // Fundo branco para os cartões
        borderLeftColor: '#4CAF50',
        borderLeftWidth: 4,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000', // Sombra para dar um efeito "elevado"
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Necessário para sombra no Android
        flexDirection: 'row', // Itens em linha
        justifyContent: 'space-between', // Espaço entre os itens
        alignItems: 'center', // Centraliza os itens verticalmente
    },
    incomeType: {
        fontSize: 18,
        fontWeight: '500',
        
    },
    incomeAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        color: '#4CAF50', // Cor verde para destacar o tipo
    },
    incomeDate: {
        fontSize: 16,
        color: '#757575', // Cor suave para as datas
    },
    container: {
        padding: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonCancel: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },

});