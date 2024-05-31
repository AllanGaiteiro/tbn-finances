import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function EditButton({ onPress }) {
    return <TouchableOpacity onPress={onPress} style={style.button}>
        <Text style={style.ButtonText}>Editar</Text>
    </TouchableOpacity>;
}

const style = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        padding: 15,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    ButtonText: {
        color: '#FFFFFF', // White
    },
});