import React, { useState, useContext,createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children, user }) => {
    const [userId, setUserId] = useState(user ? user.uid : null);

    const updateUser = (newUserId) => {
        setUserId(newUserId);
    };

    return (
        <UserContext.Provider value={{ userId, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
