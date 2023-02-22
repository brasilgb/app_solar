import React from "react";
import { View, Text, Platform } from "react-native";
import { AppHeader } from "../../components/Headers";
import AppLayout from "../../layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackPrams";

const PrivacyPolicy = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    // const source = { uri: "http://services.gruposolar.com.br:8082/midias/img/privacidade.html" };
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

            <View className="flex-1 px-2">
                <Text allowFontScaling={false} className="text-[28px] text-solar-blue-dark font-Poppins_400Regular pt-8 pb-2 self-center">Política de Privacidade</Text>
                <Text allowFontScaling={false} className="text-md text-gray-800 font-Poppins_700Bold py-1">1 – COLETA DE DADOS DO CLIENTES</Text>
                <Text allowFontScaling={false} className="text-sm text-gray-700 font-Poppins_400Regular py-1 text-justify">
                    Quando você baixa o APP Solar e acessa o aplicativo, coletamos a identificação de seu aparelho para que possamos entrar em contato com você e lhe oferecer promoções e serviços com a qualidade que somente as Lojas Solar pode lhe oferecer.
                </Text>
                <Text allowFontScaling={false} className="text-sm text-gray-700 font-Poppins_400Regular py-1 text-justify">
                    Quando você efetua o seu cadastro no Aplicativo, coletamos os dados que você nos informa: CPF, Endereço, Email e seu número de celular. Seus dados poderão ser alterados a qualquer momento por você, basta acessar a função Minha Conta do Aplicativo. Estes dados serão utilizados para uma emissão de nota fiscal, caso você compre algo nas Lojas Solar, ou até mesmo no e-commerce da empresa.
                </Text>
                <Text allowFontScaling={false} className="text-sm text-gray-700 font-Poppins_400Regular py-1 text-justify">
                    Seus dados estarão sempre a sua disposição e poderão ser apagados a qualquer momento mediante sua solicitação ou por força de lei.
                </Text>
                <Text allowFontScaling={false} className="text-sm text-gray-700 font-Poppins_400Regular py-1 text-justify">
                    A Loja Solar não compartilha, vende ou disponibiliza os dados de seus clientes, salvo por solicitação judicial, ou do Fisco.
                </Text>
            </View>
        </AppLayout>
    )
}

export default PrivacyPolicy;