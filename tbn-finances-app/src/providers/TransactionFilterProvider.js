import React, { createContext, useContext, useState } from 'react';
import { FiltersEntity } from './FiltersEntity';

const TransactionFilterContext = createContext();

export const TransactionFilterProvider = ({ children }) => {
    const [filters, setFilters] = useState(new FiltersEntity());

    return (
        <TransactionFilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </TransactionFilterContext.Provider>
    );
};

export const useTransactionFilters = () => {
    return useContext(TransactionFilterContext);
};