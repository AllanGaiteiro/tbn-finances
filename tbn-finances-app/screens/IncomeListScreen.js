import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IncomeListScreen = ({ navigation }) => {
    // Lógica para listar e adicionar rendas

    const handleAddIncome = () => {
        // Lógica para adicionar nova renda
    };
    const mockIncomeData = [
        { id: '1', description: 'Doação', amount: 'R$ 100,00' },
        { id: '2', description: 'Venda de Livros', amount: 'R$ 150,00' },
        // Adicione mais dados fictícios conforme necessário
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Rendas</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.addButtonText}>Adicionar Renda</Text>
            </TouchableOpacity>
            <ScrollView style={styles.incomeList}>
                {mockIncomeData.map(income => (
                    <View key={income.id} style={styles.incomeItem}>
                        <Text style={styles.incomeDescription}>{income.description}</Text>
                        <Text style={styles.incomeAmount}>{income.amount}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};


export default IncomeListScreen;
