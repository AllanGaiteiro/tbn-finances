import React, { useState } from 'react';
import { View, TextInput, Button, Picker, Platform } from 'react-native';
import { firestore } from '../settings/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Expense } from '../entity/Expense';
import { expenseStyles } from '../styles/expenseStyles';

export function AddExpense({ setExpenses }) {
    const [newExpense, setNewExpense] = useState(new Expense());
    const [isFormVisible, setIsFormVisible] = useState(false);
    const types = [
        { label: 'Contas', value: 'contas' },
        { label: 'Outros', value: 'outros' },
    ]
    const handleInputChange = (name, value) => {
        setNewExpense(prevExpense => ({
            ...prevExpense,
            [name]: value
        }));
    };

    const handleAddExpense = async () => {
        try {
            const docRef = await addDoc(collection(firestore, "expenses"), {
                type: newExpense.type,
                amount: newExpense.amount,
                date: newExpense.date
            });

            setExpenses(prevExpenses => [...prevExpenses, Expense.fromFirebase({ id: docRef.id, ...newExpense })]);
            setNewExpense(new Expense());
            setIsFormVisible(false);
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
        }
    };

    return (
        <View>
            <Button title={isFormVisible ? "Cancelar" : "Adicionar Gasto"} onPress={() => setIsFormVisible(!isFormVisible)} />
            {isFormVisible && (
                <View style={expenseStyles.form}>
                    <Picker
                        selectedValue={newExpense.type}
                        onValueChange={(itemValue) => handleInputChange('type', itemValue)}>
                        {types.map((t,index) => <Picker.Item key={index} label={t.label} value={t.value} />)}
                    </Picker>
                    <TextInput
                        placeholder="Montante"
                        value={String(newExpense.amount)}
                        onChangeText={(text) => handleInputChange('amount', parseFloat(text))}
                        keyboardType="numeric"
                        style={expenseStyles.input} />
                    <Button title="Salvar Gasto" onPress={handleAddExpense} />
                </View>
            )}
        </View>
    );
}
