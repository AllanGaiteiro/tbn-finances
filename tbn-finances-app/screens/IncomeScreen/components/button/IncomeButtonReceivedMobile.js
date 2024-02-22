import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';

export function IncomeButtonReceivedMobile({ setShowDatePicker }) {
    return <View>
        {Platform.OS !== 'web' &&
            <TouchableOpacity
                style={styles.receivedButton}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Selecione a Data de Recebimento</Text>
            </TouchableOpacity>}
            
    </View>;
}

export const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    receivedButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});