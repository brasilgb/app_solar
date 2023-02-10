import React, { useContext } from "react";
import { View, Text, Platform, ScrollView } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Fontisto, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/auth";

interface ItemsSideBarProps {
    iconLeft: any;
    textList: string;
    iconRight: any;
    onPress: any;
    active: boolean;
}

const SideBar = () => {
    const { signed } = useContext(AuthContext);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const ListSideBar = [
        {
            iconLeft: <Ionicons name="md-person" color={"#154295"} size={22} />,
            textList: 'Minha conta',
            iconRight: <MaterialIcons name="arrow-forward-ios" color={"#FAA335"} size={22} />,
            onPress: '',
            active: false,
        },
        {
            iconLeft: <Fontisto name="wallet" color={"#154295"} size={22} />,
            textList: 'Crediário',
            iconRight: <MaterialIcons name="arrow-forward-ios" color={"#FAA335"} size={22} />,
            onPress: '',
            active: true,
        },
        {
            iconLeft: <Fontisto name="locked" color={"#154295"} size={22} />,
            textList: 'Alterar senha',
            iconRight: <MaterialIcons name="arrow-forward-ios" color={"#FAA335"} size={22} />,
            onPress: '',
            active: true,
        },
        {
            iconLeft: <Fontisto name="locked" color={"#154295"} size={22} />,
            textList: 'Configurações de privacidade',
            iconRight: <MaterialIcons name="arrow-forward-ios" color={"#FAA335"} size={22} />,
            onPress: '',
            active: true,
        },
        {
            iconLeft: <MaterialIcons name="location-pin" color={"#154295"} size={22} />,
            textList: 'Lojas próximas de você',
            iconRight: '',
            onPress: () => navigation.navigate('CustomerLocation'),
            active: false,
        },
        {
            iconLeft: <MaterialIcons name="message" color={"#154295"} size={22} />,
            textList: 'Fale conosco',
            iconRight: '',
            onPress: '',
            active: false,
        },
        {
            iconLeft: <Fontisto name="wallet" color={"#154295"} size={22} />,
            textList: 'Faça seu pagamento',
            iconRight: '',
            onPress: '',
            active: true,
        },
        {
            iconLeft: <MaterialCommunityIcons name="cart-check" color={"#154295"} size={22} />,
            textList: 'Histórico de compras',
            iconRight: '',
            onPress: '',
            active: true,
        },
        {
            iconLeft: <Entypo name="tools" color={"#154295"} size={22} />,
            textList: 'Protocolo de assistência',
            iconRight: '',
            onPress: '',
            active: true,
        },
        {
            iconLeft: <MaterialIcons name="logout" color={"#154295"} size={22} />,
            textList: 'Logout',
            iconRight: '',
            onPress: '',
            active: true,
        }
    ]

    return (

        <AppLayout bgColor="bg-white">
            <ScrollView className="w-full" horizontal={false} showsVerticalScrollIndicator={false}>
                <AppHeader
                    auxClasses={`bg-solar-gray-dark ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                    iconLeft={<MaterialCommunityIcons name="home" color={"#FAA335"} size={36} onPress={() => navigation.navigate('Home')} />}
                    iconRight={<MaterialCommunityIcons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <View className="flex-col w-full bg-solar-gray-dark px-2 mb-52 rounded-b-3xl">
                    <View className="flex-row items-center justify-start py-2">
                        <View className="pl-0">
                            <Ionicons name="ios-person-circle-outline" color={"#154295"} size={80} />
                        </View>
                        <View className="flex-auto pl-2">
                            <Text className="font-Roboto_400Regular text-2xl text-solar-blue-dark ">Bem Vindo(a)</Text>
                            <Text className="font-Roboto_500Medium text-sm text-solar-blue-dark">Faça o login e aproveite o melhor do aplicativo</Text>
                        </View>
                    </View>
                    <View className="flex-col justify-start border-t border-gray-400 mx-2">
                        {ListSideBar.map((item: ItemsSideBarProps, index: number) => (
                            signed === item.active &&
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                            >
                                <View className="flex-row items-center my-4">
                                    <View className="pr-4">
                                        {item.iconLeft}
                                    </View>
                                    <View className="flex-auto">
                                        <Text className="font-Roboto_400Regular text-base text-solar-blue-dark">{item.textList}</Text>
                                    </View>
                                    <View>
                                        {item.iconRight}
                                    </View>
                                </View>
                            </TouchableOpacity>

                        ))}
                    </View>
                    <View className="flex-row items-center justify-center pt-4 pb-8">
                        <View className="flex-grow items-center">
                            <Text className="font-Roboto_500Medium text-xs text-solar-blue-dark">Perguntas frequentes</Text>
                        </View>
                        <View className="flex-grow items-center">
                            <Text className="font-Roboto_500Medium text-xs text-solar-blue-dark">Política de privacidade</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </AppLayout>

    )
}

export default SideBar;