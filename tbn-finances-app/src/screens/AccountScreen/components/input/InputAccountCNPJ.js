import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native'; // Importe o Alert
import { TextInputMask } from 'react-native-masked-text';
import { accountStyles } from '../../accountStyles';
import { AccountEntity } from '../../../../entity/AccountEntity';
import { PublicCNPJWS } from '../../../../core/models/ConsultaCNPJ';

export function InputAccountCNPJ({ accountData, setAccountData, editable }) {
    const [error, setError] = useState(null); // Estado para armazenar o erro


    const handleCNPJChange = (formattedCNPJ) => {
        if (formattedCNPJ !== accountData.cnpj) {
            setAccountData({ ...accountData, cnpj: formattedCNPJ });
        }
        if (formattedCNPJ !== accountData.cnpj && accountData.cnpj?.length === 18) {

            // Faz a busca por mais dados da empresa
            PublicCNPJWS.search(accountData.cnpj)
                .then(res => {
                    setAccountData(AccountEntity.publicCNPJWSForAccountEntity(accountData, res));
                    setError(null); // Limpa o erro se a busca for bem-sucedida
                })
                .catch(err => {
                    setError('Dados não encontrados. Verifique o CNPJ.'); // Define a mensagem de erro
                    console.error('Erro ao buscar dados do CNPJ:', err.message);
                });
        }
    };

    return (
        <View>
            <Text style={accountStyles.label}>CNPJ</Text>
            <TextInputMask
                type="cnpj"
                value={accountData.cnpj}
                onChangeText={handleCNPJChange}
                style={accountStyles.input}
                editable={editable}
                keyboardType="numeric"
                maxLength={18}
            />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        </View>
    );
}
