import { Text, View } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";

export const AuthContext = createContext({} as any);


interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<any>(null);
    const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);


    useEffect(() => {
        async function loadPosition() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }
            const location = await Location.getCurrentPositionAsync({});

            const { latitude, longitude } = location.coords;
            setPositionGlobal([latitude, longitude]);
        }
        loadPosition();
    }, []);


    return (
        <AuthContext.Provider value={{
            signed: !!user,
            positionGlobal
        }}>
            {children}
        </AuthContext.Provider>
    );
};