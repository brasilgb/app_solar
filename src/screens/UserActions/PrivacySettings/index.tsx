import { View, Text, Platform, KeyboardAvoidingView, ScrollView, Pressable, Image, Modal, Alert, TouchableOpacity, Switch } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppLoading from "../../../components/AppLoading"
import AppLayout from "../../../layouts/AppLayout"
import { AppHeader } from "../../../components/Headers"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../RootStackPrams"
import { AuthContext } from "../../../contexts/auth"
import { shadowAll, shadowForm } from "../../../Styles"
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import serviceapp from "../../../services/serviceapp"

interface UpImages {
    selfClient: string;
    imaDocumento: string;
    imaAssinatura: string;
    imaEndereco: string;
    imaRenda: string;
}

interface ImagesProps {
    route: any;
}

const PrivacySettings = ({ route }: ImagesProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = route?.params
    const { setLoading, loading, disconnect } = useContext(AuthContext);
    const [imageType, setImageType] = useState<string>('');

    const [isEnabled, setIsEnabled] = useState(false);
    const [autorizaCliente, setAutorizaCliente] = useState([]);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        const getAutorizaCliente = (async () => {
            await serviceapp.get(`(WS_AUTORIZA_CLIENTE)?token=${user?.token}`)
                .then((response) => {
                    setAutorizaCliente(response.data.resposta.data);
                }).catch((err) => {
                    console.log(err)
                })
        });
        getAutorizaCliente();
    }, [])
    async function storageDocs({ key, imageName, base64 }: any) {

    };
    // console.log(autorizaCliente);
    return (
        <>
            {loading &&
                <AppLoading color={"#FFFFFF"} />
            }

            <AppLayout
                bgColor="bg-solar-gray-dark"
                statusBarBG="#F1F1F1"
                statusBarStyle="dark"
            >
                <AppHeader
                    auxClasses={`bg-solar-gray-dark ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                    iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                    // iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={-14}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View className="mb-14 px-4">
                            <View className="flex-col items-center justify-center w-full my-4">
                                <Text allowFontScaling={false} className=" text-[22px] text-solar-blue-dark font-Poppins_500Medium pt-4 pb-6">
                                    Configurações de Privacidade
                                </Text>
                                <Text allowFontScaling={false} className="font-Poppins_400Regular text-lg text-solar-blue-dark text-center">
                                    Configure as opções de privacidade abaixo
                                </Text>
                            </View>

                            <View className="flex-col">
                                <View className="flex-1">
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">
                                                Quero receber notificações de promoções?
                                            </Text>

                                            {/* {autorizaCliente.map((ma: any, ke: any) => (

                                                <Text key={ke} className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{ma.pergunta}</Text>

                                            ))} */}

                                        </View>
                                        <View className="">
                                            <Switch
                                                trackColor={{ false: '#a5a5a5', true: '#F18800' }}
                                                thumbColor={isEnabled ? '#FFF' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={toggleSwitch}
                                                value={isEnabled}
                                            />
                                        </View>
                                    </View>

                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">
                                                Quero receber email de promoções?
                                            </Text>
                                        </View>
                                        <View className="">
                                            <Switch
                                                trackColor={{ false: '#a5a5a5', true: '#F18800' }}
                                                thumbColor={isEnabled ? '#FFF' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={toggleSwitch}
                                                value={isEnabled}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={shadowForm}
                                    className="flex items-center justify-center m-5 py-4 px-24 rounded-full bg-solar-orange-middle"
                                    onPress={() => navigation.navigate('ImagesSent')}
                                >
                                    <Text className="text-lg font-Poppins_500Medium text-solar-blue-dark">Concluir</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AppLayout>
        </>
    )
}

export default PrivacySettings;