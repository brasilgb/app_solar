import React from "react";
import { View, Image } from "react-native";

interface HeaderProps {
    auxClasses?: string;
    iconLeft?: any;
    iconRight?: any;
    logo: boolean;
}

const AppHeader = ({ auxClasses, iconLeft, iconRight, logo }: HeaderProps) => {
    return (
        <View className={`${auxClasses} flex-row items-center justify-between w-full px-6`}>
            <View className="py-1">
                {iconLeft}
            </View>
            <View>
                {logo &&
                    <View className="p-0.5 bg-white rounded-tl-xl rounded-br-lg">
                        <Image source={require("../../../assets/logo-solar.png")} className="h-10 w-28" />
                    </View>
                }
            </View>
            <View className="py-1">
                {iconRight}
            </View>
        </View>
    )
}

export default AppHeader;