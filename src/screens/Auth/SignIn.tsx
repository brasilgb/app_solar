import React from "react";
import { View, Text, Platform, KeyboardAvoidingView, TextInput } from "react-native";
import { AppHeader } from "../../components/Headers";
import AppLayout from "../../layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackPrams";
import { TouchableOpacity } from "react-native-gesture-handler";
import { shadowAll } from "../../Styles";

const SignIn = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    return (
        <AppLayout
            bgColor="bg-solar-gray-dark"
            statusBarBG="#F1F1F1"
            statusBarStyle="dark"
        >
            <AppHeader
                auxClasses={`bg-solar-gray-dark ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                //iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                logo={true}
            />

            <KeyboardAvoidingView className="flex-1 items-center justify-start w-full">
                <Text className="text-2xl font-Poppins_400Regular text-solar-blue-dark my-7">Antes de continuarmos...</Text>
                <Text className="text-base font-Poppins_400Regular text-solar-blue-dark">Informe seu CPF ou CNPJ</Text>
                <View className="flex items-center justify-start pt-4 w-full px-4">
                    <Text className="w-full  pl-8 text-gray-500 font-Poppins_500Medium">CPF ou CNPJ</Text>
                    <TextInput
                    style={shadowAll}
                        className="w-full py-4 px-8 rounded-full text-lg font-Poppins_400Regular bg-white text-solar-blue-dark border border-gray-300"
                    />
                    <TouchableOpacity
                    style={shadowAll}
                        className="flex items-center justify-center bg-solar-yellow-dark mt-5 py-4 px-24 rounded-full"
                    >
                        <Text className="text-lg font-Poppins_500Medium text-solar-blue-dark">Continuar</Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>

        </AppLayout>
    )
}

export default SignIn;