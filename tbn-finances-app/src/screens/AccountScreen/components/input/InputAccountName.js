import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { accountStyles } from '../../accountStyles';

export function InputAccountName({ accountData, setAccountData, editable }) {
    return <View>
        <Text style={accountStyles.label}>Nome do Conta</Text>
        <TextInput
            value={accountData.name}
            onChangeText={(text) => setAccountData({ ...accountData, name: text })}
            style={accountStyles.input}
            editable={editable} />
    </View>;
}
