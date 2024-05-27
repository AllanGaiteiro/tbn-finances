import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormExpense } from './components/FormExpense';

export function ExpenseItem({ expense }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const now = new Date().toISOString();
    const dueDate = expense.dueDate.toISOString();
    if (!expense?.transactionDate && dueDate < now) {
        expense.status = 'atrasada';
    }

    const formatDate = (date) => {
        if (!date) return ' - '; // Retorna um placeholder se a data não existir


        // Formata a data como dia/mês/ano
        const day = date.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna o mês de 0-11
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Define a função para determinar a cor da borda com base no status
    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'pendente': return '#FF9800'; // Laranja para indicar pendência
            case 'paga': return '#4CAF50'; // Verde para indicar que a despesa foi paga
            case 'atrasada': return '#F44336'; // Vermelho para indicar atraso no pagamento
            default: return '#757575'; // Cinza para estados não especificados
        }
    };

    // Aplica a cor da borda dinamicamente com base no status
    const dynamicBorderStyle = {
        borderLeftColor: getBorderColorByStatus(expense.status),
    };
    const dynamicAmountColorStyle = {
        color: getBorderColorByStatus(expense.status),
    };

    return (
        <View key={expense.id}>
            {!isFormVisible && <TouchableOpacity key={expense.id} style={[styles.expenseItem, dynamicBorderStyle]}
                onPress={() => setIsFormVisible(!isFormVisible)}>
                <Text style={[styles.expenseAmount, dynamicAmountColorStyle]}>{expense.amount}</Text>
                <Text style={styles.expenseType}>{expense.description}</Text>
                <Text style={styles.expenseDate}>{formatDate(expense.dueDate)}</Text>
            </TouchableOpacity>}
            {isFormVisible && <FormExpense expense={expense} setIsFormVisible={setIsFormVisible} />}
        </View>

    );
}

export const styles = StyleSheet.create({
    expenseItem: {
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
    expenseType: {
        fontSize: 18,
        fontWeight: '500',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    expenseDate: {
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