import React from 'react';
import { View, Button, Platform, StyleSheet, Text } from 'react-native';
import XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export const SpreadsheetGenerator = ({ transactions }) => {
    const generateSpreadsheet = async () => {
        const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(transactions.map(t => t.convertTransactionLanguageBR())));

        // Construa o caminho do arquivo com base no sistema operacional
        let path = '';

        if (Platform.OS === 'android') {
            // No Android, use o diretório de cache
            path = `${FileSystem.cacheDirectory}/transactions-${new Date().toISOString()}.csv`;
        } else {
            // No iOS, use o diretório de documentos do aplicativo
            path = `${FileSystem.documentDirectory}/transactions-${new Date().toISOString()}.csv`;
        }

        try {
            // Escreva o arquivo no sistema de arquivos
            await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
            console.log('Planilha gerada com sucesso:', path);

            // Compartilhe o arquivo
            await Sharing.shareAsync(path);
        } catch (error) {
            console.error('Erro ao gerar a planilha:', error);
        }
    };
    return (
        <TouchableOpacity style={styles.button} onPress={generateSpreadsheet}>
            <Ionicons name="md-document" size={24} color="white" />
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
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
});