import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

export function IncomeInputAmount({ income, setIncome }) {
    const handleInputChange = (name, text) => {
        // Atualiza o valor diretamente como string
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: text
        }));
    };

    const handleInputEndEditing = (name, text) => {
        // Converte para float apenas quando o usuário termina de editar
        const value = parseFloat(text) || 0;
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));
    };

    return <View>
        <Text>Valor:</Text>
        <TextInput
            placeholder="Montante"
            value={String(income.amount)}
            onChangeText={(text) => handleInputChange('amount', text.replace(',',''))}
            onEndEditing={(e) => handleInputEndEditing('amount', e.nativeEvent.text)}
            keyboardType="numeric"
            style={styles.input} />
    </View>
};


export const styles = StyleSheet.create({
    input: {
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});