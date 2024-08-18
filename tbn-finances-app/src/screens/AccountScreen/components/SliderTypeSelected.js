import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const typeOptions = [
    { label: 'Organização', value: 'organization', active: false, color: 'blue' },
    { label: 'Igreja', value: 'igreja', active: false, color: 'blue' },
    { label: 'Pessoal', value: 'pessoal', active: false, color: 'blue' },
    { label: 'Evento', value: 'event', active: false, color: 'blue' },
];

export const SliderTypeSelected = ({ accountData, setAccountData }) => {
    const getBackgroundColor = (value) => {
        const statusOption = typeOptions.find(option => option.value === value);
        return statusOption ? statusOption.color : '#ccc'; // cor padrão se não encontrado
    };

    const typeSelected = (option) => accountData?.type === option.value;
    const typeView = (option) => accountData?.id && typeSelected(option) || !accountData.id;

    return (
        <View>
            {!accountData.id ? <Text style={styles.text}>Selecione o Tipo:</Text> : null}
            <View style={styles.sliderContainer}>
                {typeOptions.map((option) =>
                    typeView(option) ?
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sliderOption,
                                typeSelected(option) ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
                            ]}
                            onPress={() => setAccountData({ ...accountData, type: option.value })}
                        >
                            <Text style={[
                                styles.sliderOptionText,
                                typeSelected(option) ? styles.activeText : styles.inactiveText
                            ]}>{option.label}</Text>
                        </TouchableOpacity> : null
                )
                }
            </View >
        </View>

    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    sliderOption: {
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 0,
        borderColor: 'none',
    },
    text: {
        marginBottom: 0,
        color: '#777',
    },
    activeOption: {
        backgroundColor: '#4CAF50',
    },
    inactiveOption: {
        //backgroundColor: '#ccc', // Cor de fundo para opções inativas
    },
    sliderOptionText: {
        textAlign: 'center',
    },
    activeText: {
        color: '#fff', // Texto branco para melhor contraste em opções ativas
    },
    inactiveText: {
        color: '#000', // Texto preto para opções não selecionadas
    },
});