import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { shadowAll } from "../../Styles";

interface ButtomProps {
    iconButtom?: any;
    textButtom: string;
    onPress?: () => void;
}

const ButtomsFooter = ({ iconButtom, textButtom, onPress }: ButtomProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-[95px] h-[95px] py-2.5 items-center justify-center bg-solar-blue-light mb-2 mx-[3px] rounded border border-gray-300"
            style={shadowAll}
        >
            {iconButtom}
            <Text allowFontScaling={false} className="text-xs font-Poppins_500Medium text-white mt-2">{textButtom}</Text>
        </TouchableOpacity>
    )
}

export default ButtomsFooter;