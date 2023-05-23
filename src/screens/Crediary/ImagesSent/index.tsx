import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import React from "react";
import AppLayout from "../../../layouts/AppLayout";
import { AppHeader } from "../../../components/Headers";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { shadowForm } from "../../../Styles";

const ImagesSent = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <AppLayout
            bgColor="bg-solar-blue-light"
            statusBarBG="#00AEEF"
            statusBarStyle="light"
        >
            <AppHeader
                auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                // iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                // iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                logo={false}
            />

            <Image
                className="self-center"
                source={require("../../../../assets/images/need_password_logo.png")}
            />
            <View className="flex-col items-center justify-center px-12">
                <Text className="mt-10 font-Poppins_300Light text-[28px] text-center text-white">Obrigado por se registrar no crediário da Solar</Text>
                <Text className="mt-1 font-Poppins_300Light text-[14px] text-center text-white">
                    Suas informações serão analisadas pela equipe das Lojas Solar e entraremos em contato.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={shadowForm}
                    className="flex w-10/12 items-center justify-center bg-solar-orange-middle mt-6 py-4 px-12 rounded-full"
                >
                    <Text className="text-lg font-Poppins_500Medium text-solar-blue-dark">Entendi</Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    )
}

export default ImagesSent;