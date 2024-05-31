import React, { useReducer, useContext, createContext } from 'react';

const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

const accountReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      return { ...state, account: action.payload };
    default:
      return state;
  }
};

// Contexto do conta
export const AccountContext = createContext();

// Provedor do contexto do conta
export const AccountProvider = ({ children, initialAccount }) => {
  const [state, dispatch] = useReducer(accountReducer, {
    account: initialAccount || null
  });

  // Função para atualizar o conta
  const updateAccount = (newAccount) => {
    dispatch({ type: UPDATE_ACCOUNT, payload: newAccount });
  };

  return (
    <AccountContext.Provider value={{ account: state.account, updateAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

// Hook para consumir o contexto do conta
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};
