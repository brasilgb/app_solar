import { View, Text, Platform, KeyboardAvoidingView, ScrollView, Pressable, Image, Modal, Alert, TouchableOpacity } from 'react-native'
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

const LoadImages = ({ route }: ImagesProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = route?.params
    const { setLoading, loading, disconnect } = useContext(AuthContext);
    const [imageType, setImageType] = useState<string>('');

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [imageSelfie, setImageSelfie] = useState<any>(null);
    const [imageDocument, setImageDocument] = useState<any>(null);
    const [imageAssignature, setImageAssignature] = useState<any>(null);
    const [imageAddress, setImageAddress] = useState<any>(null);
    const [imageFinance, setImageFinance] = useState<any>(null);
    const [imageStore, setImageStore] = useState<any>([]);

    const getPermission = async () => {

        const { granted } = await ImagePicker.requestCameraPermissionsAsync();

        if (!granted) {
            alert('Você precisa dar permissão!')
        }
    }

    const getImageUpload = (async (type: any) => {

        if (type === 'camera') {
            setTimeout(async () => {
                const result = await ImagePicker.launchCameraAsync({
                    base64: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,

                });
                setImagesUpload(result);
            }, 900);
        }

        if (type === 'gallery') {
            const result = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            setImagesUpload(result);
        }

    })
    const setImagesUpload = ((result: any) => {

        if (!result.canceled) {
            let image;
            switch (imageType) {
                case 'selfCliente': image = [setImageSelfie(result.assets[0].uri), storageDocs({ key: 'selfCliente', imageName: result.assets[0].uri, base64: result.assets[0].base64 })];
                    break;
                case 'imaDocumento': image = [setImageDocument(result.assets[0].uri), storageDocs({ key: 'imaDocumento', imageName: result.assets[0].uri, base64: result.assets[0].base64 })];
                    break;
                case 'imaAssinatura': image = [setImageAssignature(result.assets[0].uri), storageDocs({ key: 'imaAssinatura', imageName: result.assets[0].uri, base64: result.assets[0].base64 })];
                    break;
                case 'imaEndereco': image = [setImageAddress(result.assets[0].uri), storageDocs({ key: 'imaEndereco', imageName: result.assets[0].uri, base64: result.assets[0].base64 })];
                    break;
                case 'imaRenda': image = [setImageFinance(result.assets[0].uri), storageDocs({ key: 'imaRenda', imageName: result.assets[0].uri, base64: result.assets[0].base64 })];
                    break;
            }
            return image;
        }

    });

    useEffect(() => {
        getPermission();
    }, []);

    // Armazena usuário no storage
    const storageImages = (async (data: any) => {
        let numberImage = [];
        try {
            const storeImage = await AsyncStorage.getItem('StoreImg');
            if (storeImage !== null) {
                numberImage = JSON.parse(storeImage);
            }
            numberImage = numberImage.filter((ki: any) => (ki.key !== data.key));
            numberImage.push(data);
            await AsyncStorage.setItem('StoreImg', JSON.stringify(numberImage));
        } catch (error) {
            console.log(error);
        }
    });

    const contentUpload = [
        { Description: "Tire uma selfie", ImaDoc: "selfCliente", Icon: require('../../../../assets/images/docs/selfie.png') },
        { Description: "Tire uma foto do RG ou CNH", ImaDoc: "imaDocumento", Icon: require('../../../../assets/images/docs/document.png') },
        { Description: "Tire uma foto da sua assinatura", ImaDoc: "imaAssinatura", Icon: require('../../../../assets/images/docs/signature.png') },
        { Description: "Tire uma foto do seu comprovante de residência", ImaDoc: "imaEndereco", Icon: require('../../../../assets/images/docs/address.png') },
        { Description: "Tire uma foto do seu comprovante de renda", ImaDoc: "imaRenda", Icon: require('../../../../assets/images/docs/voucher.png') }
    ];

    useEffect(() => {
        async function loadStorage() {
            // await AsyncStorage.clear();
            // setImageStore([])
            const storageImage = await AsyncStorage.getItem('StoreImg');
            if (storageImage) {
                let images = JSON.parse(storageImage);
                setImageSelfie(images.filter((fi: any) => (fi.key === 'selfCliente')).map((im: any) => (im.imageName))[0])
                setImageDocument(images.filter((fi: any) => (fi.key === 'imaDocumento')).map((im: any) => (im.imageName))[0])
                setImageAssignature(images.filter((fi: any) => (fi.key === 'imaAssinatura')).map((im: any) => (im.imageName))[0])
                setImageAddress(images.filter((fi: any) => (fi.key === 'imaEndereco')).map((im: any) => (im.imageName))[0])
                setImageFinance(images.filter((fi: any) => (fi.key === 'imaRenda')).map((im: any) => (im.imageName))[0])
            }
        };
        loadStorage();
    });

    async function storageDocs({ key, imageName, base64 }: any) {

        storageImages({ key: key, imageName: imageName });
        setLoading(true);
        await serviceapp.post(`(WS_IMAGENS_CLIENTE)`, {
            token: user.token,
            selfCliente: key === 'selfCliente' ? base64 : '',
            imaDocumento: key === 'imaDocumento' ? base64 : '',
            imaAssinatura: key === 'imaAssinatura' ? base64 : '',
            imaEndereco: key === 'imaEndereco' ? base64 : '',
            imaRenda: key === 'imaRenda' ? base64 : ''
        })
            .then((response) => {
                setLoading(false);
                if (response) {
                    Alert.alert('Sucesso', 'Imagem enviada com sucesso');
                }

            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {loading &&
                <AppLoading color={"#FFFFFF"} />
            }

            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 items-center justify-end bg-[#0000007b]" onTouchEnd={() => setModalVisible(false)}>
                    <View className="bg-[#f1f1f1eb] w-full rounded-t-3xl border border-white">
                        <Text className="text-[20px] text-solar-blue-dark font-Poppins_500Medium py-2 pl-6">Selecione a fonte</Text>
                        <View className="border-b border-gray-300 mb-4 mx-4" />
                        <View className={`flex-row items-center justify-around ${Platform.OS === 'ios' ? 'pb-8' : 'pb-6'}`}>
                            <TouchableOpacity
                                className="flex-col items-center p-2 bg-solar-gray-dark rounded-lg"
                                style={shadowForm}
                                onPress={() => getImageUpload('camera')}
                            >
                                <Ionicons name='ios-camera' size={45} color="#024D9F" />
                                <Text className="text-xs text-solar-blue-dark">Câmera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-col items-center p-2 bg-solar-gray-dark rounded-lg"
                                style={shadowForm}
                                onPress={() => getImageUpload('gallery')}
                            >
                                <Ionicons name='ios-image' size={45} color="#024D9F" />
                                <Text className="text-xs text-solar-blue-dark">Galeria</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <AppLayout
                bgColor="bg-solar-gray-dark"
                statusBarBG="#F1F1F1"
                statusBarStyle="dark"
            >
                <AppHeader
                    auxClasses={`bg-solar-gray-dark ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                    iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                    iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={-14}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View className="mb-14 px-4">
                            <View className="flex-col items-center justify-center w-full my-4">
                                <Text allowFontScaling={false} className=" text-[28px] text-solar-blue-dark font-Poppins_400Regular p-4">
                                    Documentos
                                </Text>
                                <Text allowFontScaling={false} className="font-Poppins_400Regular text-lg text-solar-blue-dark text-center">
                                    Você deve enviar uma selfie e uma foto do seu documento
                                </Text>
                            </View>

                            <View className="flex-col">

                                <Pressable
                                    onPress={() => { setModalVisible(!modalVisible); setImageType('selfCliente') }}
                                >
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{contentUpload[0].Description}</Text>
                                        </View>
                                        <View className="">
                                            {imageSelfie
                                                ? <Image className="w-12 h-12" source={{ uri: imageSelfie }} />
                                                : <Image className="w-12 h-12" source={contentUpload[0].Icon} />
                                            }
                                        </View>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => { setModalVisible(!modalVisible); setImageType('imaDocumento') }}
                                >
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{contentUpload[1].Description}</Text>
                                        </View>
                                        <View className="">
                                            {imageDocument
                                                ? <Image className="w-12 h-12" source={{ uri: imageDocument }} />
                                                : <Image className="w-12 h-12" source={contentUpload[1].Icon} />
                                            }
                                        </View>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => { setModalVisible(!modalVisible); setImageType('imaAssinatura') }}
                                >
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{contentUpload[2].Description}</Text>
                                        </View>
                                        <View className="">
                                            {imageAssignature
                                                ? <Image className="w-12 h-12" source={{ uri: imageAssignature }} />
                                                : <Image className="w-12 h-12" source={contentUpload[2].Icon} />
                                            }
                                        </View>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => { setModalVisible(!modalVisible); setImageType('imaEndereco') }}
                                >
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{contentUpload[3].Description}</Text>
                                        </View>
                                        <View className="">
                                            {imageAddress
                                                ? <Image className="w-12 h-12" source={{ uri: imageAddress }} />
                                                : <Image className="w-12 h-12" source={contentUpload[3].Icon} />
                                            }
                                        </View>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => { setModalVisible(!modalVisible); setImageType('imaRenda') }}
                                >
                                    <View className="w-full flex-row items-center justify-between bg-solar-gray-middle border border-solar-gray-light rounded-lg px-2 py-4 mb-4" style={shadowAll}>
                                        <View className="w-[80%]">
                                            <Text className="text-[16px] text-solar-blue-dark font-Poppins_500Medium">{contentUpload[4].Description}</Text>
                                        </View>
                                        <View className="">
                                            {imageFinance
                                                ? <Image className="w-12 h-12" source={{ uri: imageFinance }} />
                                                : <Image className="w-12 h-12" source={contentUpload[4].Icon} />
                                            }
                                        </View>
                                    </View>
                                </Pressable>

                                <TouchableOpacity
                                    style={shadowForm}
                                    className={`flex items-center justify-center m-5 py-4 px-24 rounded-full ${imageSelfie && imageDocument && imageAssignature && imageAddress && imageFinance ? ' bg-solar-orange-middle' : 'bg-solar-gray-dark'}`}
                                    onPress={() => navigation.navigate('ImagesSent')}
                                    disabled={imageSelfie && imageDocument && imageAssignature && imageAddress && imageFinance ? false : true}
                                >
                                    <Text className={`text-lg font-Poppins_500Medium  ${imageSelfie && imageDocument && imageAssignature && imageAddress && imageFinance ? ' text-solar-blue-dark' : 'text-gray-300'}`}>Continuar</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AppLayout>
        </>
    )
}

export default LoadImages;