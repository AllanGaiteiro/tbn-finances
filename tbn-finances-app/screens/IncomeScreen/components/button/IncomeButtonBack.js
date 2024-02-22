import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export function IncomeButtonBack({ isVisible = true, setIsFormVisible }) {
    return isVisible && <TouchableOpacity
        style={styles.backButton}
        onPress={() => setIsFormVisible(false)}>
        <Text style={styles.buttonText}>Fechar</Text>
    </TouchableOpacity>;
}


export const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    backButton: {
        backgroundColor: '#2196F3' ,
        justifyContent: 'center',
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 10,
    }
});
