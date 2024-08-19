import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';

export function IncomeButtonLastRecurrenceDateMobile({ setShowDatePicker, }) {
    return Platform.OS !== 'web' &&
        <View>
            <TouchableOpacity
                style={styles.receivedButton}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Adicionar Recebimento</Text>
            </TouchableOpacity>
        </View>;
}

export const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    receivedButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});
