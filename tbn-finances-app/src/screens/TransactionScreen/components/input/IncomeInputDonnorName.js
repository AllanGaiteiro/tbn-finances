import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export function IncomeInputDonnorName({ isVisible, income, setIncome }) {

    const handleInputChange = (name, value) => {
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return isVisible &&
        <View>
            <Text>Descrição sobre o valor:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a descrição ..."
                value={income.description}
                onChangeText={(text) => handleInputChange('description', text)} />
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