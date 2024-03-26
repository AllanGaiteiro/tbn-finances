import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePikerMobile } from '../../../../components/DatePikerMobile';
import { ExpenseButtonDateMobile } from '../button/ExpenseButtonDueDateMobile';

export function ExpenseInputDueDateMobile({ isVisible, setExpense }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const textButton = 'Selecione a Data de Vencimento';
    const handleInputChange = (name, value) => {
        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return isVisible && <View>
        <ExpenseButtonDateMobile textButton={textButton} setShowDatePicker={setShowDatePicker} />
        <DatePikerMobile name='dueDate' setShowDatePicker={setShowDatePicker} handleInputChange={handleInputChange} showDatePicker={showDatePicker} />
    </View>;
}


