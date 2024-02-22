import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';

export function IncomeInputReceivedDateWeb({ newIncome, setIncome, isVisible }) {
    const handleInputChange = (name, value) => {
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return Platform.OS === 'web' && isVisible && <View>
        <Text>Recebido em: </Text>
        <input
            type="date"
            value={newIncome?.receivedDate ? newIncome.receivedDate.toISOString().substring(0, 10) : ''}
            onChange={(event) => handleInputChange('receivedDate', new Date(event.target.value))}
            style={{ ...styles.input, cursor: 'pointer' }} // Estilo adicional para web
        />

    </View>;
}

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
