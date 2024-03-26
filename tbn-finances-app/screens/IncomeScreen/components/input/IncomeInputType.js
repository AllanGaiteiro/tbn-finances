import React from 'react';
import { TypesSlider } from '../../../../components/TypeSlider';

export function IncomeInputType({ income, setIncome }) {
    const typesOptions = [
        { label: 'Alçada', value: 'oferta_alcada', color: '#2196F3' },
        { label: 'Voluntaria', value: 'oferta_voluntaria', color: '#2196F3' },
        { label: 'Mensal', value: 'oferta_mensal', color: '#2196F3' },
    ];
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
        options={typesOptions}
        currentType={income.type}
        onTypeChange={(value) => handleInputChange('type', value)} />;
}
