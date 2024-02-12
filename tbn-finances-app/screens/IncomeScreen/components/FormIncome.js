import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Switch } from 'react-native';
import { Income } from '../../../entity/Income';
import { FormFieldDatePikerWeb } from './FormFieldDatePikerWeb';
import { FormFieldDatePikerMobile } from './FormFieldDatePikerMobile';
import { incomeRepository } from '../../../repositories/IncomeRepository';
import { FormFieldPiker } from './FormFieldPiker';
import { StatusSlider } from './StatusSlider';
import { TypesSlider } from './TypeSlider';
import RecurrenceSwitch from './RecurrenceSwitch';


export function FormIncome({ income: incomeItem, setIsFormVisible }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [income, setIncome] = useState(incomeItem || new Income());

    const formValidateAmount = (income) => !income.amount || isNaN(income.amount) || income.amount <= 0;
    const formValidateType = (income) => !income.type;
    const formValidateIsRecurrence = (income) => !income.isRecurrence && !income.receivedDate;
    const formValidate = () => formValidateAmount(income) || formValidateType(income) || formValidateIsRecurrence(income)

    const validateForm = () => {
        const title = 'Erro';
        const message = "Por favor, selecione um"
        if (formValidateType(income)) {
            Alert.alert(title, message + " tipo de renda.");
            return false;
        }
        if (formValidateAmount(income)) {
            Alert.alert(title, message + " montante válido.");
            return false;
        }
        if (formValidateIsRecurrence(income)) {
            Alert.alert(title, message + "a data de recebimento.");
            return false;
        }
        return true;
    };

    const handleAddIncome = async () => {
        if (validateForm()) {
            // Tente adicionar a renda ao Firestore
            try {
                if (income.id && income.isRecurrence && income.status === 'recebido') {
                    console.log('csadcsadxsa')
                    await incomeRepository.handleRecurrenceUpdate(income)
                } else if (income.id) {
                    await incomeRepository.updateIncome(income)
                } else {
                    await incomeRepository.addIncome({
                        ...income,
                        creationDate: new Date() // Data de criação definida no momento da adição
                    });
                }

                Alert.alert("Sucesso", "Renda adicionada com sucesso!");
                setIncome(new Income()); // Reinicie o formulário
                setIsFormVisible(false); // Esconda o formulário
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
                Alert.alert("Erro", "Não foi possível adicionar a renda.");
            }
        }
    };

    const handleInputChange = (name, value) => {
        console.log(name, value)
        if ((name === 'amount' || name === 'recurrenceDay') && isNaN(value)) {
            value = 0;
        }

        if (name === 'isRecurrence' && value === true) {
            handleInputChange('receivedDate', null);
            handleInputChange('recurrenceDay', 28);
        }

        if (name === 'isRecurrence' && value === false) {
            handleInputChange('receivedDate', new Date());
            handleInputChange('recurrenceDay', null);
        }

        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return <View style={styles.form}>
        <TypesSlider
            currentType={income.type}
            onTypeChange={(value) => handleInputChange('type', value)}
        />
        {income.type !== 'oferta_igreja' &&
            <TextInput
                style={styles.input}
                placeholder="Nome do Doador"
                value={income.donorName}
                onChangeText={(text) => handleInputChange('donorName', text)} />}
        <StatusSlider
            currentStatus={income.status}
            onStatusChange={(value) => handleInputChange('status', value)}
        />
        {income.status === 'recebido' &&
            <FormFieldPiker field="account" income={income} handleInputChange={handleInputChange} />}
        <TextInput
            placeholder="Montante"
            value={String(income.amount)}
            onChangeText={(text) => handleInputChange('amount', parseFloat(text))}
            keyboardType="numeric"
            style={styles.input} />
        <View style={styles.recurrenceRow}>
            <RecurrenceSwitch
                isRecurrence={income.isRecurrence}
                onToggle={(value) => handleInputChange('isRecurrence', value)}
            />

            {/*income?.isRecurrence && (
                <TextInput
                    style={[styles.input, styles.recurrenceInput]}
                    placeholder="Dia (1-31)"
                    value={String(income.recurrenceDay)}
                    onChangeText={(text) => handleInputChange('recurrenceDay', parseInt(text))}
                    keyboardType="numeric"
                />
            )*/}
            {/*!income?.isRecurrence &&
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.buttonText}>Data de Recebimento</Text>
                </TouchableOpacity>
        */}
        </View>

        {income?.isRecurrence &&
            <TextInput
                style={styles.input}
                placeholder="Dia da recorrência (1-31)"
                value={String(income.recurrenceDay)}
                onChangeText={(text) => handleInputChange('recurrenceDay', parseInt(text))}
                keyboardType="numeric"
            />
        }
        {!income?.isRecurrence &&
            <TouchableOpacity
                style={styles.receivedButton}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Data de Recebimento</Text>
            </TouchableOpacity>
        }

        {showDatePicker && (
            <FormFieldDatePikerMobile setShowDatePicker={setShowDatePicker} handleInputChange={handleInputChange} />
        )}
        <FormFieldDatePikerWeb income={income} handleInputChange={handleInputChange} />
        <TouchableOpacity disabled={formValidate()} style={formValidate() ? styles.saveButtonDisabled : styles.button} onPress={handleAddIncome}>
            <Text style={formValidate() ? styles.saveButtonTextDisabled : styles.saveButtonText}>Salvar as Alterações</Text>
        </TouchableOpacity>
    </View>;
}

export const styles = StyleSheet.create({
    // Demais estilos permanecem inalterados
    recurrenceRow: {
        flexDirection: 'row',
        marginBottom: 15
    },
    recurrenceLabel: {
        flex: 1,
    },
    recurrenceInput: {
        flex: 2,
        marginLeft: 10, // Ajuste conforme necessário para o espaçamento
    },
    container: {
        padding: 20,
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    pickerContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    form: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10
    },
    input: {
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    datePicker: {
        marginBottom: 15,
    },
    picker: {
        marginBottom: 15,
    },
    receivedButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonDisabled: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    saveButtonTextDisabled: {
        color: '#000000',
        fontSize: 16,
    },
});
