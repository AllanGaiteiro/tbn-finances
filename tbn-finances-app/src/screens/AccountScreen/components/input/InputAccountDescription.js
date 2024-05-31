import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { accountStyles } from '../../accountStyles';

export function InputAccountDescription({ accountData, setAccountData,editable }) {
    return <View>
        <Text style={accountStyles.label}>Descrição</Text>
        <TextInput
            value={accountData.description}
            onChangeText={(text) => setAccountData({ ...accountData, description: text })}
            style={accountStyles.input}
            editable={editable} />
    </View>;
}
