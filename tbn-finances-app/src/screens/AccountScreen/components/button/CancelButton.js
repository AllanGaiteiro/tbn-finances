import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function CancelButton({ onPress }) {
    return <TouchableOpacity onPress={onPress} style={style.cancelButton}>
        <Text style={style.cancelButtonText}>Cancelar</Text>
    </TouchableOpacity>;
}

const style = StyleSheet.create({
    cancelButton: {
        backgroundColor: '#FF5722', // Orange
        borderColor: '#FF5722', // Orange
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#FFFFFF', // White
    },
});