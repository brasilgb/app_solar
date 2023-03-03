import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { shadowAll } from "../../Styles";

interface Props {
    color: string;
}

export default function AppLoading({ color }: Props) {

    return (
        <View className="left-0 right-0 bottom-0 top-0 items-center justify-center z-20 absolute">
            <ActivityIndicator
                size="large"
                color={color}
                className="bg-solar-blue-dark p-4 rounded-lg opacity-90"
                style={shadowAll}
            />
        </View>
    );
}