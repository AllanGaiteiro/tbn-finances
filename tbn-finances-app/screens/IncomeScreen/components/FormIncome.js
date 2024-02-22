import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { Income } from '../../../entity/Income';
import { incomeRepository } from '../../../repositories/IncomeRepository';
import { IncomeInputType } from './input/IncomeInputType';
import { IncomeInputDonnorName } from './input/IncomeInputDonnorName';
import { IncomeInputAmount } from './input/IncomeInputAmount';
import { IncomeInputIsRecurrence } from './input/IncomeInputIsRecurrence';
import { IncomeInputReceivedDateMobile } from './input/IncomeInputReceivedDateMobile';
import { IncomeButtonCancel } from './button/IncomeButtonCancel';
import { IncomeButtonSave } from './button/IncomeButtonSave';
import { IncomeInputReceivedDateWeb } from './input/IncomeInputReceivedDateWeb';
import { IncomeInputLastRecurrenceDateMobile } from './input/IncomeInputLastRecurrenceDateMobile';
import { IncomeInputLastRecurrenceDateWeb } from './input/IncomeInputLastRecurrenceDateWeb';
import { IncomeButtonBack } from './button/IncomeButtonBack';


export function FormIncome({ income: incomeItem, isFormVisible, setIsFormVisible }) {
    const [income, setIncome] = useState(incomeItem || new Income());
    const lastRecurrenceDate = income?.lastRecurrenceDate || null;
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

    const handleSetIncome = async () => {
        if (validateForm()) {

            try {
                if (income.id && income.type === 'oferta_mensal' ) {
                    await incomeRepository.handleRecurrenceUpdate(income)
                } else if (income.id) {
                    await incomeRepository.updateIncome(income)
                } else {
                    income.creationDate = new Date()
                    await incomeRepository.addIncome(income);
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

    return <View style={styles.form}>
        <Text style={styles.title}>{income.id ? 'Detalhes da ' : 'Adicionar'} Oferta</Text>

        <IncomeInputType income={income} setIncome={setIncome} />

        <IncomeInputDonnorName isVisible={income.type !== 'oferta_alcada'} income={income} setIncome={setIncome} />

        <IncomeInputAmount income={income} setIncome={setIncome} />
        
        <IncomeInputReceivedDateMobile isVisible={!income?.isRecurrence} setIncome={setIncome} />
        <IncomeInputReceivedDateWeb isVisible={!income?.isRecurrence} income={income} setIncome={setIncome} />

        <IncomeInputLastRecurrenceDateMobile isVisible={income?.isRecurrence && income?.id} income={income} setIsFormVisible={setIsFormVisible}  />
        <IncomeInputLastRecurrenceDateWeb isVisible={income?.isRecurrence && income?.id} income={income} setIsFormVisible={setIsFormVisible}  />
        
        <IncomeButtonCancel isVisible={income?.id} income={income} setIsFormVisible={setIsFormVisible} />

        <View style={styles.datePickerContainer}>
            <IncomeButtonSave formValidate={formValidate} save={handleSetIncome} />
            <IncomeButtonBack setIsFormVisible={setIsFormVisible} />
        </View>
    </View>;
}

export const styles = StyleSheet.create({

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
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
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
});


