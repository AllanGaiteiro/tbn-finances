import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MemberBalloon({ member, collor }) {
    return (
        <View style={[styles.balloon, { backgroundColor: collor || 'rgba(0, 128, 255, 0.2)' }]}>
            <Text style={styles.memberText}>{member}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    balloon: {
        backgroundColor: 'rgba(0, 128, 255, 0.2)', // Azul claro e transparente
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    memberText: {
        fontSize: 16,
    },
});

