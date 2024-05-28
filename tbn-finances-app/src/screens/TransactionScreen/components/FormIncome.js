import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { Income } from '../../../entity/Income';
import { IncomeInputType } from './input/IncomeInputType';
import { IncomeInputDonnorName } from './input/IncomeInputDonnorName';
import { IncomeInputAmount } from './input/IncomeInputAmount';
import { IncomeInputReceivedDateMobile } from './input/IncomeInputReceivedDateMobile';
import { IncomeButtonCancel } from './button/IncomeButtonCancel';
import { IncomeInputReceivedDateWeb } from './input/IncomeInputReceivedDateWeb';
import { IncomeInputLastRecurrenceDateMobile } from './input/IncomeInputLastRecurrenceDateMobile';
import { IncomeInputLastRecurrenceDateWeb } from './input/IncomeInputLastRecurrenceDateWeb';
import { ButtonBack } from '../../../components/ButtonBack';
import { ButtonSave } from '../../../components/ButtonSave';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { useUser } from '../../../providers/UserProvider';


export function FormIncome({ income: incomeItem, isFormVisible, setIsFormVisible }) {
    const [income, setIncome] = useState(incomeItem || new Income());
    const { userId } = useUser();

     

    const formValidateAmount = (income) => !income.amount || isNaN(income.amount) || income.amount <= 0;
    const formValidateType = (income) => !income.type;
    const formValidateIsRecurrence = (income) => !income.isRecurrence && !income.transactionDate;
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
                if (income.id && income.type === 'oferta_mensal') {
                    await transactionRepository(userId).income.handleRecurrenceUpdate(income)
                } else if (income.id) {
                    await transactionRepository(userId).income.updateIncome(income)
                } else {
                    income.creationDate = new Date()
                    await transactionRepository(userId).income.addIncome(income);
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

        <IncomeInputLastRecurrenceDateMobile isVisible={income?.isRecurrence && income?.id} income={income} setIsFormVisible={setIsFormVisible} />
        <IncomeInputLastRecurrenceDateWeb isVisible={income?.isRecurrence && income?.id} income={income} setIsFormVisible={setIsFormVisible} />

        <IncomeButtonCancel isVisible={income?.id} income={income} setIsFormVisible={setIsFormVisible} />

        <View style={styles.datePickerContainer}>
            <ButtonSave formValidate={formValidate} save={handleSetIncome} />
            <ButtonBack setIsFormVisible={setIsFormVisible} />
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
});


