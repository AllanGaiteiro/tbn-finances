import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { SliderAccountIsSelected } from './SliderAccountIsSelected';
import { useAccount } from '../../../providers/AccountProvider';
import { ExpensesLateCardNumber } from './ExpensesLateCardNumber';

export function FormAccountHeader({ accountData, expand }) {
    const { account, updateAccount } = useAccount()
    const [accountSelected, setAccountSelected] = useState(null);

    useEffect(() => {
        setAccountSelected(accountData?.id && account === accountData?.id);
    }, [account])

    return <View style={styles.accountHeader}>
        <Card.Title style={[styles.cardTitle]} title={!accountData?.id ? 'Criar Nova Conta' : accountData.name} />

        {accountData?.id && !expand ? <ExpensesLateCardNumber accountData={accountData} /> : null}

        {accountData?.id && accountSelected && !expand ? <SliderAccountIsSelected
            accountData={accountData}
            stylesWidth={styles.stylesWidth}
            stylesPaddingHorizontal={styles.stylesPaddingHorizontal}
            disabled={true} /> : null}
    </View >;
}

const styles = StyleSheet.create({
    accountHeader: {
        flexDirection: 'row', // Itens em linha
        justifyContent: 'space-between', // Espaço entre os itens
        width: '100%'
    },
    cardTitle: {
        marginBottom: 10,
        flex: 1
    },
    stylesWidth: {
        width: '35%',
    },
    stylesPaddingHorizontal: {
        paddingHorizontal: 10
    },
})
