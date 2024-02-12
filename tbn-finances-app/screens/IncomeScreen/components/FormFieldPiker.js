import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export function FormFieldPiker({ income, field, handleInputChange }) {

    const account = [
        { label: 'Conta Corrente', value: 'conta_corrente' },
        { label: 'Conta Poupança', value: 'conta_poupanca' },
        // Adicione mais contas conforme necessário
    ];
    return <View style={styles.pickerContainer}>
        <Picker
            selectedValue={income[field]}
            onValueChange={(itemValue) => handleInputChange(field, itemValue)}>
            {account.map((t, index) => <Picker.Item key={index} label={t.label} value={t.value} />)}
        </Picker>
    </View>;
}


export const styles = StyleSheet.create({
    pickerContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        overflow: 'hidden',
    },
});