import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ButtonSave } from '../../../components/ButtonSave';
import { ButtonBack } from '../../../components/ButtonBack';
import { ExpenseInputType } from './input/ExpenseInputType';
import { ExpenseInputAmount } from './input/ExpenseInputAmount';
import { ExpenseInputTotalInstallments } from './input/ExpenseInputTotalInstallments';
import { ExpenseInputDescription } from './input/ExpenseInputDescription';
// import { ExpenseInputImage } from './input/ExpenseInputImage';
import { Expense } from '../../../entity/Expense';
import { ExpenseInputDueDateWeb } from './input/ExpenseInputDueDateWeb';
import { ExpenseInputDueDateMobile } from './input/ExpenseInputDueDateMobile';
import { ExpenseInputPaymentDateMobile } from './input/ExpenseInputPaymentDateMobile';
import { ExpenseInputPaymentDateWeb } from './input/ExpenseInputPaymentDateWeb';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { useAccount } from '../../../providers/AccountProvider';

export function FormExpense({ expense: expenseItem = new Expense(), isFormVisible, setIsFormVisible }) {
    const [expense, setExpense] = useState(expenseItem );
    const { account } = useAccount();

    const formValidateAmount = (expense) => !expense.amount || isNaN(expense.amount) || expense.amount <= 0;
    const formValidateType = (expense) => !expense.type;
    const formValidateDescription = (expense) => !expense.description;
    const formValidate = () => formValidateAmount(expense) || formValidateType(expense) || formValidateDescription(expense);


    const validateForm = () => {
        const title = 'Erro';
        const message = "Por favor, selecione um";
        if (formValidateType(expense)) {
            Alert.alert(title, message + " tipo de renda.");
            return false;
        }
        if (formValidateAmount(expense)) {
            Alert.alert(title, message + " montante válido.");
            return false;
        }
        if (formValidateDescription(expense)) {
            Alert.alert(title, message + " a descrição.");
            return false;
        }
        return true;
    };

    const handleSetExpense = async () => {
        if (validateForm()) {

            try {
                if (expense.id && expense.type === 'mensal') {
                    await transactionRepository(account.id).expense.updateExpense(expense);
                } else if (expense.id) {
                    expense.lastUpdateDate = new Date();
                    await transactionRepository(account.id).expense.updateExpense(expense);
                } else {
                    expense.creationDate = new Date();
                    await transactionRepository(account.id).expense.addExpense(expense);
                }

                setExpense(new Expense()); // Reinicie o formulário
                setIsFormVisible(false); // Esconda o formulário
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
                Alert.alert("Erro", "Não foi possível adicionar a despesa.");
            }
        }

    };



    return <View style={styles.form}>
        <Text style={styles.title}>{expense.id ? 'Detalhes da' : 'Adicionar'} Despesa</Text>
        <ExpenseInputType expense={expense} setExpense={setExpense} />
        <ExpenseInputDescription expense={expense} setExpense={setExpense} />
        <ExpenseInputTotalInstallments expense={expense} setExpense={setExpense} />
        <ExpenseInputAmount expense={expense} setExpense={setExpense} />

        <ExpenseInputDueDateWeb isVisible={expense.id}
            expense={expense} setExpense={setExpense} />
        <ExpenseInputDueDateMobile isVisible={expense.id} setExpense={setExpense} />

        <ExpenseInputPaymentDateWeb isVisible={expense.id}
            expense={expense} setExpense={setExpense} />
        <ExpenseInputPaymentDateMobile isVisible={expense.id} setExpense={setExpense} />
        {/*
        <ExpenseInputImage expense={expense} />
        */}
        <View style={styles.datePickerContainer}>
            <ButtonSave formValidate={formValidate} save={handleSetExpense} />
            <ButtonBack setIsFormVisible={setIsFormVisible} />
        </View>
        {/*
        <expenseInputReceivedDateMobile isVisible={!expense?.isRecurrence} setexpense={setexpense} />
        <expenseInputReceivedDateWeb isVisible={!expense?.isRecurrence} expense={expense} setexpense={setexpense} />

        <expenseInputLastRecurrenceDateMobile isVisible={expense?.isRecurrence && expense?.id} expense={expense} setIsFormVisible={setIsFormVisible} />
        <expenseInputLastRecurrenceDateWeb isVisible={expense?.isRecurrence && expense?.id} expense={expense} setIsFormVisible={setIsFormVisible} />

        <expenseButtonCancel isVisible={expense?.id} expense={expense} setIsFormVisible={setIsFormVisible} />
        */}
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


