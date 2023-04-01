import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import React from "react";
import AppLayout from "../../../layouts/AppLayout";
import { AppHeader } from "../../../components/Headers";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { shadowForm } from "../../../Styles";

const PasswordAltered = ({ route }: any) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { data } = route.params;
    return (
        <AppLayout
            bgColor="bg-solar-blue-light"
            statusBarBG="#00AEEF"
            statusBarStyle="light"
        >
            <AppHeader
                auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                // iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                logo={false}
            />

            <Image
                className="self-center"
                source={require("../../../../assets/images/new_password_logo.png")}
            />
            <View className="flex-col items-center justify-center px-12">
                <Text className="mt-10 font-Poppins_300Light text-[24px] text-center text-white">Enviamos uma nova senha para o seu e-mail</Text>
                <Text className="my-4 font-Poppins_300Light text-[18px] text-center text-yellow-300">{data}</Text>
                <Text className="mt-1 font-Poppins_300Light text-[14px] text-center text-white">
                Acesse seu e-mail e entre com a sua nova senha, você poderá alterar sua senha no menu Minha Conta.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    style={shadowForm}
                    className="flex items-center justify-center bg-solar-orange-middle mt-6 py-4 px-12 rounded-full"
                >
                    <Text className="text-lg font-Poppins_500Medium text-solar-blue-dark">Fazer login</Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    )
}

export default PasswordAltered;