import React from "react";
import { View } from "react-native";

interface FooterProps {
    children: React.ReactNode;
}

const AppFooter = ({ children }: FooterProps) => {
    return (
        <View className="">
            {children}
        </View>
    )
}

export default AppFooter;