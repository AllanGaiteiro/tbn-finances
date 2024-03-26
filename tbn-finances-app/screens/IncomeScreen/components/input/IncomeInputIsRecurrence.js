import React from 'react';
import { View } from 'react-native';
import RecurrenceSwitch from '../RecurrenceSwitch';

export function IncomeInputIsRecurrence({ income, setIncome }) {
    const handleInputChange = (name, value) => {
        if (name === 'isRecurrence' && value === true) {
            handleInputChange('status', 'em_progresso');
            handleInputChange('receivedDate', null);
            // handleInputChange('recurrenceDay', 28);
        }

        if (name === 'isRecurrence' && value === false) {
            handleInputChange('receivedDate', new Date());
            // handleInputChange('recurrenceDay', null);
        }

        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };

    return <View style={styles.recurrenceRow}>
        <RecurrenceSwitch
            isRecurrence={income.isRecurrence}
            onToggle={(value) => handleInputChange('isRecurrence', value)} />
    </View>;
}
export const styles = StyleSheet.create({
    recurrenceRow: {
        flexDirection: 'row',
        marginBottom: 15
    },
});