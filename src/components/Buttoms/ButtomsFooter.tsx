import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { shadowAll } from "../../Styles";

interface ButtomProps {
    iconButtom?: any;
    textButtom: string;
    onPress?: () => Promise<void>;
}

const ButtomsFooter = ({ iconButtom, textButtom, onPress }: ButtomProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-[88.4px] h-[88.4px] py-2.5 items-center justify-center bg-solar-blue-light mb-2 mx-[3px] rounded border border-gray-300"
            style={shadowAll}
        >
            {iconButtom}
            <Text className="text-xs font-Roboto_500Medium text-white mt-2">{textButtom}</Text>
        </TouchableOpacity>
    )
}

export default ButtomsFooter;