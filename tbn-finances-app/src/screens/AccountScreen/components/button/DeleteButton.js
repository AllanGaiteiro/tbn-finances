import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function DeleteButton({ onPress }) {
    return <TouchableOpacity onPress={onPress} style={style.button}>
        <Text style={style.ButtonText}>Deletar</Text>
    </TouchableOpacity>;
}

const style = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        borderColor: 'red', // Cor da borda
        borderWidth: 1,
        alignSelf: 'flex-end',
    },
    ButtonText: {
        fontWeight: 'bold',
    },
});