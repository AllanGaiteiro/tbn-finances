import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { TransactionEntity } from '../../../entity/TransactionEntity';

export const SpreadsheetGenerator = ({ transactions }) => {
    const generateSpreadsheet = async () => {
        // Cria uma nova planilha
        const ws_data = transactions.map(t => TransactionEntity.convertTransactionLanguageBR(t));
        console.log('Dados da planilha:', ws_data);

        const ws = XLSX.utils.json_to_sheet(ws_data);

        // Cria o livro de trabalho (workbook)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transações');

        // Gera o arquivo
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        let path = '';
        if (Platform.OS === 'android') {
            path = `${FileSystem.cacheDirectory}/transactions-${new Date().toISOString()}.xlsx`;
        } else {
            path = `${FileSystem.documentDirectory}/transactions-${new Date().toISOString()}.xlsx`;
        }

        try {
            // Escreve o arquivo no sistema de arquivos
            await FileSystem.writeAsStringAsync(path, wbout, { encoding: FileSystem.EncodingType.Base64 });
            console.log('Planilha gerada com sucesso:', path);

            // Compartilha o arquivo
            await Sharing.shareAsync(path);
        } catch (error) {
            console.error('Erro ao gerar a planilha:', error);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={generateSpreadsheet}>
            <Ionicons name="document" size={24} color="white" />
            <Text style={styles.buttonText}>Gerar Planilha</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        marginLeft: 8,
    },
});

export default SpreadsheetGenerator;
