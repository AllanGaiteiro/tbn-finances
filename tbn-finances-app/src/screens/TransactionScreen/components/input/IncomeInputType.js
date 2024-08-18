import React, { useEffect, useState } from 'react';
import { TypesSlider } from '../../../../components/TypeSlider';
import { incomeTypeRepository } from '../../../../repositories/IncomeTypesRepository';
import { TypeOptionEntity } from '../../../../entity/TypeOptionEntity';

export function IncomeInputType({ accountData: item, income, setIncome }) {
    const [accountData, setAccountData] = useState(item);

    const [typesOptions, setTypesOptions] = useState([new TypeOptionEntity()]);

    useEffect(() => {
        const unsubscribe = incomeTypeRepository.getIncomeTypesByIds(accountData.incomesTypeIds, setTypesOptions)
        return () => unsubscribe();
    }, [accountData?.incomesTypeIds])

    const handleInputChange = (name, value) => {
        if (name === 'type') {
            const type = typesOptions.find(t => t.id === value.id);

            if (type && type.action === 'recorrente') {
                handleInputChange('isRecurrence', true)
                handleInputChange('status', 'em_progresso');
                handleInputChange('transactionDate', null);
                handleInputChange('lastRecurrenceDate', new Date());
            }
            if (type && type.action !== 'recorrente' && income.type === 'oferta_mensal') {
                handleInputChange('isRecurrence', false)
                handleInputChange('transactionDate', new Date());
                handleInputChange('status', 'recebido');
                handleInputChange('lastRecurrenceDate', null);
            }
        }
        setIncome(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));
    };
    return <TypesSlider
        options={typesOptions}
        currentType={income.type}
        onlyValue={false}
        onTypeChange={(value) => handleInputChange('type', value)} />;
}
