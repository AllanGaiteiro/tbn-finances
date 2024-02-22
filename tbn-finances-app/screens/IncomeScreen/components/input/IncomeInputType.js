import React from 'react';
import { TypesSlider } from '../TypeSlider';

export function IncomeInputType({ income, setIncome }) {

    const handleInputChange = (name, value) => {
        console.log(name, value)

        if (name === 'type' && value === 'oferta_mensal') {
            handleInputChange('isRecurrence', true)
            handleInputChange('status', 'em_progresso');
            handleInputChange('receivedDate', null);
            handleInputChange('lastRecurrenceDate', new Date());
        }
        if (name === 'type' && value !== 'oferta_mensal' && income.type === 'oferta_mensal') {
            handleInputChange('isRecurrence', false)
            handleInputChange('receivedDate', new Date());
            handleInputChange('status', 'recebido');
            handleInputChange('lastRecurrenceDate', null);

        }

        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return <TypesSlider
        currentType={income.type}
        onTypeChange={(value) => handleInputChange('type', value)} />;
}
