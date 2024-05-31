import React, { useState, useContext, createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children, user: userData }) => {
    const [user, setUser] = useState(userData ? userData: null);

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
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
