import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform, Image, ImageBackground, Animated, LayoutAnimation, Dimensions } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { ButtomsQuestions } from "../../../components/Buttoms";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../constants";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { toggleAnimation } from "../../../components/animations/toggleAnimation";

const CommonQuestions = ({ route }: any) => {

    const { data } = route?.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [activeIndex, setActiveIndex] = useState<string>('Comercial');
    const [currentCategory, setCurrentCategory] = useState<string>("Comercial");
    const [carregaFaq, setCarregaFaq] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const animationController = useRef(new Animated.Value(0)).current;

    const toggleListItem = (ind: any) => {
        const config = {
            duration: 300,
            toValue: showContent ? 0 : 1,
            useNativeDriver: true
        };
        Animated.timing(animationController, config).start();
        LayoutAnimation.configureNext(toggleAnimation);
        setCurrentIndex(ind === currentIndex ? null : ind);
    };

    const handleSetQuestions = ((category: any) => {
        setActiveIndex(category === activeIndex ? null : category)
        setCurrentCategory(category);
    });

    useEffect(() => {
        async function getCarregaFaq() {
            await serviceapp.get(`(WS_CARREGA_FAQ)`)
                .then((response) => {
                    const result = response.data.resposta.data.categorias.filter((z: any) => (z.Categoria.xCategoria.trim() === currentCategory));
                    const resp = result.map((cat: any, index: any) => (cat.Categoria));
                    setCarregaFaq(resp);
                })
                .catch((error) => {
                    console.log(error)
                })
        };
        getCarregaFaq();
    }, [currentCategory])

    const [right, setRight] = useState(new Animated.Value(Dimensions.get('window').width - 100));
    const [radius, setRadius] = useState(new Animated.Value(0));

    const leftToRight = () => {
        Animated.parallel([
            Animated.timing(radius, {
                toValue: 200,
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.timing(right, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const rightToLeft = () => {
        Animated.parallel([
            Animated.timing(radius, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(right, {
                toValue: Dimensions.get('window').width - 100,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <AppLayout
            bgColor="bg-solar-gray-light px-0.5"
            statusBarBG="#FAFAFA"
            statusBarStyle="dark"
        >
            <ScrollView className="w-full">
                <AppHeader
                    auxClasses={`bg-solar-gray-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                    iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                    //iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={false}
                />
                <View className="flex-col items-center px-4">
                    <Text allowFontScaling={false} className="text-[28px] text-solar-blue-dark font-Poppins_400Regular py-5 self-center">Perguntas Frequentes</Text>
                    <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-Poppins_400Regular py-3 self-center">
                        Elaboramos respostas para as dúvidas mais frequentes, selecione o assunto e confira:
                    </Text>
                </View>
                <View className="flex-row items-center justify-around mt-10 w-full">
                    <ButtomsQuestions
                        onpress={() => { handleSetQuestions("Comercial"); rightToLeft() }}
                        text="Comercial"
                        currentIndex={activeIndex}
                    />
                    <ButtomsQuestions
                        onpress={() => { handleSetQuestions("Crediário"); leftToRight() }}
                        text="Crediário"
                        currentIndex={activeIndex}
                    />
                </View>
                <View className="flex-row items-center justify-around w-full pt-6">
                    <Animated.View style={{
                        marginTop: '1%',
                        height: 6,
                        width: 6,
                        right: right,
                        position: 'absolute',
                        justifyContent: 'center',
                        borderRadius: radius,
                        bottom: -5
                    }}
                    >
                        <View className="w-6 h-6 bg-[#e4e2e2] rotate-45" />
                    </Animated.View>
                </View>

                <View className="flex-1 bg-[#e4e2e2] w-full rounded-t-3xl">

                    {carregaFaq.map((categoria: any, icate: any) => (
                        categoria.perguntas.map((ca: any, ind: any) => (
                            <View key={ind} className="border-b border-[#c1c1c1] px-2">

                                <TouchableOpacity
                                    className="py-8"
                                    onPress={() => toggleListItem(ind)}
                                >
                                    <View className="flex-row items-start justify-between">
                                        <View className="flex-none w-[320px]">
                                            <Text className="text-[14px] font-Poppins_500Medium">{ca.pergunta}</Text>
                                        </View>
                                        <View className="w-8">
                                            {currentIndex === ind
                                                ? <MaterialIcons name={'keyboard-arrow-down'} size={30} color="#FAA335" />
                                                : <MaterialIcons name={'keyboard-arrow-up'} size={30} color="#FAA335" />
                                            }
                                        </View>
                                    </View>

                                </TouchableOpacity>
                                {currentIndex === ind &&
                                    (
                                        <View className="pt-4 pb-10">
                                            <Text className="px-2 text-[14px] font-Poppins_500Medium text-gray-400">{ca.resposta}</Text>
                                        </View>
                                    )
                                }

                            </View>
                        ))
                    ))}

                </View>
            </ScrollView>
        </AppLayout >
    )
}

export default CommonQuestions;
