import React from 'react';
import { View,Text, TextInput } from 'react-native';
import { styles } from '../FormIncome';

export function IncomeInputRecurrenceDay({ income, setIncome }) {
    const handleInputChange = (name, value) => {

        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return !income?.isRecurrence && <View>
        <Text>Dia Esperado:</Text>
        <TextInput
            style={styles.input}
            placeholder="Dia da recorrência (1-31)"
            value={String(income.recurrenceDay)}
            onChangeText={(text) => handleInputChange('recurrenceDay', parseInt(text))}
            keyboardType="numeric" />
    </View>;
}
