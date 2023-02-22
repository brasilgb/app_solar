import React from "react";
import { View, Text, Platform, Image, ImageBackground } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { shadowAll } from "../../../Styles";

const ContactUs = () => {

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
            <View className="flex-grow items-center">
                <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark font-Poppins_400Regular py-5 self-center">Fale conosco</Text>

                <ImageBackground
                    source={require('../../../../assets/images/girl_background.png')}
                    resizeMode='cover'
                    className="h-[212px] flex-row items-center justify-center bg-solar-gray-light border-2 border-white my-5 mx-6 rounded-xl"
                    style={[shadowAll]}
                >
                    <Text allowFontScaling={false} className="flex-1 text-lg font-Poppins_400Regular text-solar-blue-dark pl-3">
                        Para dúvidas, reclamações ou observações
                    </Text>
                    <View className="flex-1 " />
                </ImageBackground>
                <Text allowFontScaling={false} className="text-xl font-Poppins_700Bold text-solar-blue-dark pt-5">51-3638-5000</Text>
                <Text allowFontScaling={false} className="text-base font-Poppins_500Medium text-solar-blue-dark py-5">sac@lojasolar.com.br</Text>
                <Text allowFontScaling={false} className="text-lg font-Poppins_400Regular text-solar-blue-dark">Av. Duque de Caxias,385</Text>
                <Text allowFontScaling={false} className="text-lg font-Poppins_400Regular text-solar-blue-dark">Centro - Salvador do Sul - RS</Text>
                <Text allowFontScaling={false} className="text-lg font-Poppins_400Regular text-solar-blue-dark">CEP: 95750-000</Text>
            </View>
            <Text allowFontScaling={false} className="text-base font-Poppins_500Medium text-solar-blue-dark py-2">V1.0.0</Text>
        </AppLayout >
    )
}

export default ContactUs;
