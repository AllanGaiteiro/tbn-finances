import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export function AccountAddUser({ handleOpenModal }) {
    return <TouchableOpacity onPress={handleOpenModal} style={accountAddUserStyle.addInput}>
        <Text style={accountAddUserStyle.addButtonText}>Alterar</Text>
    </TouchableOpacity>;
}
const accountAddUserStyle = StyleSheet.create({
    addInput: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
