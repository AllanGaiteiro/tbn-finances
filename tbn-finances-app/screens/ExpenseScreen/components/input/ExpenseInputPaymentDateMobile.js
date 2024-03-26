import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePikerMobile } from '../../../../components/DatePikerMobile';
import { ExpenseButtonDateMobile } from '../button/ExpenseButtonDueDateMobile';


export function ExpenseInputPaymentDateMobile({ isVisible, setExpense }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const textButton = 'Pagamento efetuado em';
    const handleInputChange = (name, value) => {
        if (name === 'paymentDate' && value) {
            handleInputChange('status', 'pago');
        }
        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return isVisible && <View>
        <ExpenseButtonDateMobile textButton={textButton} setShowDatePicker={setShowDatePicker} />
        <DatePikerMobile name='paymentDate' setShowDatePicker={setShowDatePicker} handleInputChange={handleInputChange} showDatePicker={showDatePicker} />
    </View>;
}
