import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { accountTypeRepository } from '../../../repositories/AccountTypeRepository';
import { AccountTypeEntity } from '../../../entity/AccountTypeEntity';

export const SliderTypeSelected = ({ accountData, setAccountData }) => {
    const [accountTypes, setAccountTypes] = useState(new AccountTypeEntity());
    const [loadingAccountType, setLoadingAccountType] = useState(true);

    useEffect(() => {
        const unsubscribe = accountTypeRepository.observeAccountType(setAccountTypes, setLoadingAccountType)
        return () => unsubscribe();
    }, [accountData]);

    const handlerSetAccount = (option) => {
        setAccountData({ ...accountData, type: option.value, incomesTypeIds: option.incomeTypes, expenseTypeIds: option.expenseTypes })
    }

    const getBackgroundColor = (value) => {
        const statusOption = accountTypes.find(option => option.value === value);
        return statusOption ? 'blue' : '#ccc'; // cor padrão se não encontrado
    };

    const typeSelected = (option) => accountData?.type === option.value;
    const typeView = (option) => accountData?.id && typeSelected(option) || !accountData.id;

    if (loadingAccountType) {
        return
    }

    return (
        <View>
            {!accountData.id ? <Text style={styles.text}>Selecione o Tipo:</Text> : null}
            <View style={styles.sliderContainer}>
                {accountTypes.map((option) =>
                    typeView(option) ?
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sliderOption,
                                typeSelected(option) ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
                            ]}
                            onPress={() => handlerSetAccount(option)}
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
        flexWrap: 'wrap',
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