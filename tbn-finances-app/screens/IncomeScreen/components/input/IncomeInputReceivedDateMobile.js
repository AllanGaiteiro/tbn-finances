import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePikerMobile } from '../../../../components/DatePikerMobile';
import { IncomeButtonReceivedMobile } from '../button/IncomeButtonReceivedMobile';

export function IncomeInputReceivedDateMobile({isVisible, setIncome }) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (name, value) => {
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return isVisible && <View>
        <IncomeButtonReceivedMobile setShowDatePicker={setShowDatePicker} />
        <DatePikerMobile name='receivedDate' setShowDatePicker={setShowDatePicker} handleInputChange={handleInputChange} showDatePicker={showDatePicker} />
    </View>;
}


