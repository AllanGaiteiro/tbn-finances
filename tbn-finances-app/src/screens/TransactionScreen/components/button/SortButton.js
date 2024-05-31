import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const SortButton = ({ label, onPress, active, sortOrder }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: 'transparent',
                borderWidth: 0, // Remover borda
                borderRadius: 0, // Remover borda arredondada
                padding: 0, // Remover padding interno
                margin: 0, // Remover margem
                justifyContent: 'center', // Alinhar o texto ao centro
                alignItems: 'center', // Alinhar o texto ao centro
            }}
        >
            <Text style={{ color: active ? '#007bff' : '#000', fontSize: 16 }}>{`${label} ${active ? (sortOrder === 'asc' ? '▲' : '▼') : ''}`}</Text>
        </TouchableOpacity>
    );
};
