import { Text, View } from 'react-native'
import React, { Component, createContext, useState } from 'react'

export const AuthContext = createContext({} as any);

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<any>(null);
    
    return (
        <AuthContext.Provider value={{
            signed: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};