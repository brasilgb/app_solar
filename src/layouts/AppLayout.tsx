import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Props {
    children: React.ReactNode;
    bgColor: string;
};

const AppLayout = ({ children, bgColor }: Props) => {
    return (

        <SafeAreaView className={`flex-1 items-center justify-start ${bgColor} w-full`}>
            <StatusBar backgroundColor="black" style={`${Platform.OS === 'ios' ? 'dark' : 'light'}`} />
            {children}
            <View className={`${Platform.OS === 'ios' ? "-m-[17px]" : ""}`}></View>
        </SafeAreaView>

    )
}
export default AppLayout;