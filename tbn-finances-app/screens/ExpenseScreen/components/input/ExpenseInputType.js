import React from 'react';
import { TypesSlider } from '../../../../components/TypeSlider';

//  "Mensal", "Parcela", "Única"
export function ExpenseInputType({ expense, setExpense }) {
    const typesOptions = [
        { label: 'Mensal', value: 'mensal', color: '#2196F3' },
        { label: 'Parcela', value: 'parcela', color: '#2196F3' },
        { label: 'Única', value: 'unica', color: '#2196F3' },
    ];
    const handleInputChange = (name, value) => {

        if (name === 'type' && value === 'mensal') {
            handleInputChange('isRecurrence', true)
        }

        if (name === 'type' && value !== 'mensal' && expense.type === 'mensal') {
            handleInputChange('isRecurrence', false)
        }

        if (name === 'type' && value !== 'parcela') {
            handleInputChange('totalInstallments', null);
            handleInputChange('currentInstallment', null);
        }


        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return <TypesSlider
        options={typesOptions}
        currentType={expense.type}
        onTypeChange={(value) => handleInputChange('type', value)} />;
}
