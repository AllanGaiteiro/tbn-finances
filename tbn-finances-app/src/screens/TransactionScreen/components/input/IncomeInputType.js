import React, { useEffect, useState } from 'react';
import { TypesSlider } from '../../../../components/TypeSlider';
import { transactionTypeRepository } from '../../../../repositories/TransactionTypesRepository';
import { TypeOptionEntity } from '../../../../entity/TypeOptionEntity';

export function IncomeInputType({ accountData: item, income, setIncome }) {
    const [accountData, setAccountData] = useState(item);

    const [typesOptions, setTypesOptions] = useState([new TypeOptionEntity()]);

    useEffect(() => {
        const unsubscribe = transactionTypeRepository('incomeTypes').getTransctionTypesByIds(accountData.incomesTypeIds, setTypesOptions)
        return () => unsubscribe();
    }, [accountData?.incomesTypeIds])

    const handleInputChange = (name, value) => {
        if (name === 'type') {
            const type = typesOptions.find(t => t.id === value.id);

            if (type && type.action === 'recorrence') {
                handleInputChange('isRecurrence', true)
                handleInputChange('status', 'em_progresso');
                handleInputChange('transactionDate', null);
                handleInputChange('lastRecurrenceDate',income.lastRecurrenceDate || new Date());
            }
            if (type && type.action !== 'recorrence') {
                handleInputChange('isRecurrence', false)
                handleInputChange('transactionDate',income.transactionDate || new Date());
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