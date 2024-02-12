import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Income } from '../../../entity/Income';
import { FormIncome } from './FormIncome';

export function AddIncome({ income = new Income() }) {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsFormVisible(!isFormVisible)}>
                <Text style={styles.buttonText}>{isFormVisible ? 'Fechar' : 'Adicionar Renda'}</Text>
            </TouchableOpacity>
            {isFormVisible &&
                <FormIncome income={new Income()}  setIsFormVisible={setIsFormVisible}  />
            }
        </View>
    );
}

export const styles = StyleSheet.create({
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
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
