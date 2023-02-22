import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { shadowAll } from "../../Styles";

interface QuestionsProps {
    onpress: any;
    text: string;
    currentIndex: string;
}
const ButtomsQuestions = ({ onpress, text, currentIndex }: QuestionsProps) => {
    return (
        <TouchableOpacity
            onPress={onpress}
            className={`w-40 h-24 border-2 ${ text === currentIndex ? 'bg-solar-orange-middle border-solar-yellow-light' : 'bg-solar-gray-light border-solar-blue-dark'}  items-center justify-center rounded-lg`}
            style={shadowAll}
        >
            <Text className="text-xl font-Poppins_500Medium text-solar-blue-dark">{text}</Text>
        </TouchableOpacity>
    )
}

export default ButtomsQuestions;