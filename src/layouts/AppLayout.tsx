import React from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStatusBar from "../components/StatusBar";

interface Props {
    children: React.ReactNode;
    bgColor: string;
    statusBarStyle?: any;
    statusBarBG?: string;
};

const AppLayout = ({ children, bgColor, statusBarBG, statusBarStyle }: Props) => {
    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>
            <AppStatusBar style={statusBarStyle} background={statusBarBG} />
                {children}
            <View className={`${Platform.OS === 'ios' ? "-m-[17px]" : ""}`} />
        </SafeAreaView>
    )
};
export default AppLayout;