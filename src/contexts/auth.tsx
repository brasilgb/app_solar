import { Alert, Text, View } from "react-native";
import React, { createContext, useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import serviceapp from "../services/serviceapp";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../screens/RootStackPrams";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_DATA } from "../constants";
export const AuthContext = createContext({} as any);


interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);

    // Armazena usuário no storage
    async function storageUser(data: any) {
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }

    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('Auth_user');
            if (storageUser) {
                setUser(JSON.parse(storageUser));
            }
        };
        loadStorage();
    });

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

    const signIn = useCallback(async ({ cpfcnpj }: any) => {
        const response = await serviceapp.get(`${URL_DATA}(WS_LOGIN_APP)?cpfcnpj=${cpfcnpj}`);
        if (response.status !== 200) {
            throw new Error("Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.");
        }
        const { crediario, message, data } = response.data.resposta;
        if (!data.cadastroCliente && !data.cadastroSenha) {
            navigation.navigate('NoRegistry', { data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente } });
            return;
        }
        if (data.cadastroCliente && !data.cadastroSenha) {
            navigation.navigate('RegisteredStore', { data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente } });
            return;
        }
        if (data.cadastroCliente && data.cadastroSenha) {
            navigation.navigate('CheckPassword', { data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente } });
            return;
        }
    }, [])

    const checkPasswordApp = useCallback(async ({ cpfcnpj, senha, nomeCliente, connected }: any) => {
        setLoading(true);
        const response = await serviceapp.get(`${URL_DATA}(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${cpfcnpj}&senha=${senha}`);

        if (response.status !== 200) {
            setLoading(false);
            throw new Error("Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.");
        }

        const { success, message, data } = response.data.resposta;
        if (!success) {
            setUser(undefined);
            setLoading(false);
            Alert.alert('Erro', `${message}`);
            return;
        }

        let userData = {
            connected: connected,
            cpfCnpj: cpfcnpj,
            nomeCliente: nomeCliente,
            token: data.token
        };

        storageUser(userData);
        setUser(userData);
        navigation.navigate('Home');
    }, []);

    async function signOut() {
        Alert.alert(
            'Atenção - Ação de Logout',
            'Você será desconectado, deseja continuar?',
            [
                { text: 'Sim', onPress: () => disconnect() },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            { cancelable: false }

        );
    }

    async function disconnect() {
        await AsyncStorage.clear()
            .then(() => {
                setUser(null);
            })
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            setLoading,
            loading,
            positionGlobal,
            signIn,
            checkPasswordApp,
            signOut,
            disconnect
        }}>
            {children}
        </AuthContext.Provider>
    );
};