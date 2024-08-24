import React, { useEffect, useState } from 'react';
import { TypesSlider } from '../../../../components/TypeSlider';
import { transactionTypeRepository } from '../../../../repositories/TransactionTypesRepository';
import { TypeOptionEntity } from '../../../../entity/TypeOptionEntity';

export function ExpenseInputType({ accountData: item, expense, setExpense }) {
    const [accountData, setAccountData] = useState(item);
    const [typesOptions, setTypesOptions] = useState([new TypeOptionEntity()]);

    useEffect(() => {
        const unsubscribe = transactionTypeRepository('expenseTypes').getTransctionTypesByIds(accountData.expenseTypeIds, setTypesOptions)
        return () => unsubscribe();
    }, [accountData?.expenseTypeIds])

    const handleInputChange = (name, value) => {
        /*
        if (name === 'type') {
            const type = typesOptions.find(t => t.id === value.id);
            
            if (type && type.action === 'recorrence') {
                handleInputChange('isRecurrence', true)
                handleInputChange('status', 'em_progresso');
                handleInputChange('transactionDate', null);
                handleInputChange('lastRecurrenceDate', new Date());
            }
            if (type && type.action !== 'recorrence') {
                handleInputChange('isRecurrence', false)
                handleInputChange('transactionDate', new Date());
                handleInputChange('status', 'recebido');
                handleInputChange('lastRecurrenceDate', null);
            }
            
        } */

        setExpense(prevIncome => ({
            ...prevIncome,
            [name]: value
        }));

    };
    return <TypesSlider
        options={typesOptions}
        currentType={expense.type}
        onlyValue={false}
        onTypeChange={(value) => handleInputChange('type', value)} />;
}
