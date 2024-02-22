import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';


export function IncomeInputLastRecurrenceDateWeb(isVisible, income, setIsFormVisible) {
    const handleInputChange = (name, value) => {
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return Platform.OS === 'web' && isVisible && <View>
        <Text>Ultimo recebimento em: </Text>
            <input
                type="date"
                value={newIncome?.lastRecurrenceDate ? newIncome.lastRecurrenceDate.toISOString().substring(0, 10) : ''}
                onChange={(event) => handleInputChange('lastRecurrenceDate', new Date(event.target.value))}
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
