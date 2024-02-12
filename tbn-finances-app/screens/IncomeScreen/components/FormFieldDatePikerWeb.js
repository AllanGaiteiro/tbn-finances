import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

export function FormFieldDatePikerWeb({ newIncome, handleInputChange }) {
    return <View>
        {Platform.OS === 'web' && (
            <input
                type="date"
                value={newIncome.receivedDate ? newIncome.receivedDate.toISOString().substring(0, 10) : ''}
                onChange={(event) => handleInputChange('receivedDate', new Date(event.target.value))}
                style={{ ...styles.input, cursor: 'pointer' }} // Estilo adicional para web
            />
        )}
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
