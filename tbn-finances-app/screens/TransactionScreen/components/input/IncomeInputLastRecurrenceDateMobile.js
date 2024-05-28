import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { DatePikerMobile } from '../../../../components/DatePikerMobile';
import { IncomeButtonLastRecurrenceDateMobile } from '../button/IncomeButtonLastRecurrenceDateMobile';
import { incomeRepository } from '../../../../repositories/IncomeRepository';


export function IncomeInputLastRecurrenceDateMobile({ isVisible, income, setIsFormVisible }) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleRecibed = async (name, value) => {
        const updateIncome = income;
        updateIncome[name] = value;
        try {
            await incomeRepository.handleRecurrenceUpdate(updateIncome)
            setIsFormVisible(false);
            Alert.alert("Adicionado", "A receita foi adicionada.");
        } catch (error) {
            console.error("Erro ao adicionar nova receita: ", error);
            Alert.alert("Erro", "Não foi possível adicionar nova receita.");
        }
    };

    return isVisible && <View>
        <IncomeButtonLastRecurrenceDateMobile setShowDatePicker={setShowDatePicker} />
        <DatePikerMobile name='lastRecurrenceDate' setShowDatePicker={setShowDatePicker} handleInputChange={handleRecibed} showDatePicker={showDatePicker} />
    </View>;
}
