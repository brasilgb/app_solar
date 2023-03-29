import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { View, Text, Platform, KeyboardAvoidingView, Dimensions, TouchableOpacity, Keyboard, Pressable, Alert, ActivityIndicator } from "react-native";
import AppLoading from "../../../components/AppLoading";
import { AppHeader } from "../../../components/Headers";
import { AuthContext } from "../../../contexts/auth";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { Formik } from "formik";
import schema from "./schema";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import FormInput from "../../../components/FormInput";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../Constants";
import { cnpj, cpf } from "cpf-cnpj-validator";
import AppModal from "../../../components/AppModal";
import { maskCelular, maskCep, maskDate, unMask } from "../../../utils/masks";
import { shadowAll, shadowForm } from "../../../Styles";

interface RegisterUserProps {
    route: any;
}

interface FormProps {
    cpfcnpj: any;
    nomeCliente: string;
    enderecoCliente: string;
    cepCliente: string;
    cidadeCliente: string;
    ufCliente: string;
    celularCliente: string;
    emailCliente: string;
    nascimentoCliente: string;
}
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const RegisterUser = ({ route }: RegisterUserProps) => {

    const { data } = route.params;
    const { loading } = useContext(AuthContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [ufLoad, setUfLoad] = useState([]);
    const [cityLoad, setCityLoad] = useState([]);
    const [ufIsModalVisible, setUfIsModalVisible] = useState(false);
    const [cityIsModalVisible, setCityIsModalVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loadingModal, setLoadingModal] = useState(false);

    const changeModalUfVisibility = (bool: boolean) => {
        getStateStore();
        setUfIsModalVisible(bool);
    }

    const changeModalCityVisibility = (bool: boolean) => {
        getCitiesStore();
        setCityIsModalVisible(bool);
    }

    const onPressUf = (option: any) => {
        changeModalUfVisibility(false);
        setSelectedUf(option);
    }

    const onPressCity = (option: any) => {
        changeModalCityVisibility(false);
        setSelectedCity(option);
    }

    const handleLoadCidade = (bool: boolean) => {

        if (selectedUf === '') {
            Alert.alert('Atenção', 'Selecione um estado para conseguir selecionar uma cidade.');
        } else {
            changeModalCityVisibility(bool);
        }

    }

    const getStateStore = useCallback(async () => {
        const result = await serviceapp.get(`${URL_DATA}(WS_CARREGA_UF)`)
        if (result) {
            setUfLoad(result.data.resposta.data);
        }
    }, [])

    const getCitiesStore = useCallback(async () => {
        setLoadingModal(true);
        const result = await serviceapp.get(`${URL_DATA}(WS_CARREGA_CIDADE)?uf=${selectedUf}`);
        if (result) {
            setCityLoad(result.data.resposta.data.map((c: any) => c.cidade).filter((value: any, index: any, self: any) => self.indexOf(value) === index));
            setFilteredData(result.data.resposta.data.map((c: any) => c.cidade).filter((value: any, index: any, self: any) => self.indexOf(value) === index));
            setLoadingModal(false);
        }
    }, [selectedUf]);

    // envio do formulário
    const onSubmit = (async (values: FormProps) => {

        const response = await serviceapp.get(`${URL_DATA}(WS_PRIMEIRO_ACESSO)?cpfcnpj=${values.cpfcnpj}&nomeCliente=${values.nomeCliente}&enderecoCliente=${values.enderecoCliente}&cepCliente=${unMask(values.cepCliente)}&cidadeCliente=${values.cidadeCliente}&ufCliente=${values.ufCliente}&celularCliente=${values.celularCliente}&emailCliente=${values.emailCliente}&nascimentoCliente=${values.nascimentoCliente}`);
        const { success, message, data } = response.data.resposta;
        if (success) {
            navigation.navigate("Registered", { data: unMask(values.cpfcnpj) });
        } else {
            Alert.alert('Erro', message);
        }
    });

    // Formatação CPF CNPJ
    const formatCpfCnpj = ((num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    })

    const searchFilter = (text: any) => {
        if (text) {
            const newData = cityLoad.filter(
                function (item: any) {
                    if (item) {
                        const itemData = item.toUpperCase();
                        const textData = text.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                });
            setFilteredData(newData);
            setSearch(text);
        } else {
            setFilteredData(cityLoad);
            setSearch(text);
        }
    };

    return (
        <Fragment>

            {loading &&
                <AppLoading color={"#FFFFFF"} />
            }

            {/* Modal list estado do cliente */}
            <AppModal
                modalVisible={ufIsModalVisible}
                onTouchEnd={() => changeModalUfVisibility(false)}
            >
                <View className="pb-2" style={{ width: WIDTH - 20, height: HEIGHT / 4 }}>

                    <View className="flex-row items-center justify-between border-b border-b-gray-300">
                        <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">Selecione uma opção</Text>
                        <MaterialIcons name="close" size={30} color="#FAA335" onPress={() => changeModalUfVisibility(false)} />
                    </View>

                    {ufLoad.map((u: any, iu: any) => (
                        <TouchableOpacity key={iu}
                            onPress={() => onPressUf(u.uf)}
                        >
                            <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium"
                            >{u.uf}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
            </AppModal>

            {/* Modal list cidade do cliente */}
            <AppModal
                modalVisible={cityIsModalVisible}
                onTouchEnd={() => changeModalCityVisibility(false)}
            >
                <View className="pb-2" style={{ width: WIDTH - 20, height: HEIGHT - 100 }}>
                    <View className="flex-row items-center justify-between border-b border-b-gray-300">
                        <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">Selecione uma opção</Text>
                        <MaterialIcons name="close" size={30} color="#FAA335" onPress={() => changeModalCityVisibility(false)} />
                    </View>
                    <View className="bg-gray-400 border-y border-y-gray-100">
                        <View className="flex-row items-center justify-between my-2 mx-2 px-2 rounded-full bg-gray-50">
                            <MaterialIcons name="search" size={32} color="#024D9F" onPress={() => navigation.goBack()} />
                            <TextInput
                                className="bg-gray-50 rounded-full flex-1 text-base"
                                onChangeText={(text) => searchFilter(text)}
                                value={search}
                                underlineColorAndroid="transparent"
                                placeholder="Buscar cidade"
                            />
                        </View>
                    </View>
                    {loadingModal
                        ? <View className="flex-1 items-center justify-center">
                            <ActivityIndicator
                                size="large"
                                color="#154295a2"
                                // className="bg-solar-blue-dark p-4 rounded-lg opacity-90"
                                style={shadowAll}
                            />
                        </View>
                        : <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                            {filteredData.map((c: any, ic: any) => (
                                <TouchableOpacity key={ic}
                                    onPress={() => onPressCity(c)}
                                >
                                    <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium"
                                    >{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    }

                </View>
            </AppModal>

            <AppLayout
                bgColor="bg-solar-gray-light"
                statusBarBG="#FAFAFA"
                statusBarStyle="dark"
            >

                <AppHeader
                    auxClasses={`bg-solar-gray-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                    iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                    iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={-14}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-14 px-4">

                            <Text allowFontScaling={false} className="text-[28px] text-solar-blue-dark font-Poppins_400Regular py-5 text-center">Faça seu cadastro nas Lojas Solar!</Text>
                            <Text allowFontScaling={false} className="text-[18px] text-solar-blue-dark font-Poppins_500Medium py-5 text-center">Ou preencha o formulário abaixo</Text>
                            <View className="flex-row items-center justify-start w-full mb-8">
                                <Feather name="alert-triangle" color={"#b1b1b1"} size={22} />
                                <Text allowFontScaling={false} className="text-[14px] text-gray-400 font-Poppins_400Regular_Italic pt-1 pl-2 self-start">
                                    Todos os dados são obrigatórios
                                </Text>
                            </View>
                            <Formik
                                validationSchema={schema}
                                initialValues={{
                                    cpfcnpj: formatCpfCnpj(data),
                                    nomeCliente: '',
                                    enderecoCliente: '',
                                    cepCliente: '',
                                    cidadeCliente: '',
                                    ufCliente: '',
                                    celularCliente: '',
                                    emailCliente: '',
                                    nascimentoCliente: ''
                                }}
                                onSubmit={onSubmit}
                            >

                                {({ handleChange, handleBlur, setValues, setFieldValue, handleSubmit, setFieldTouched, values, touched, errors, isValid }) => (

                                    <View className="w-full">


                                        <FormInput
                                            title="CPF ou CNPJ"
                                            value={values.cpfcnpj}
                                            isValid={true}
                                            editable={false}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Nome completo"
                                            onChangeText={handleChange('nomeCliente')}
                                            onBlur={() => setFieldTouched('nomeCliente')}
                                            value={values.nomeCliente}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.nomeCliente}
                                            touched={touched.nomeCliente}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Endereco"
                                            onChangeText={handleChange('enderecoCliente')}
                                            onBlur={() => setFieldTouched('enderecoCliente')}
                                            value={values.enderecoCliente}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.enderecoCliente}
                                            touched={touched.enderecoCliente}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="CEP"
                                            onChangeText={handleChange('cepCliente')}
                                            onBlur={() => setFieldTouched('cepCliente')}
                                            value={maskCep(values.cepCliente)}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.cepCliente}
                                            touched={touched.cepCliente}
                                            maxLength={9}
                                            keyboarType="numeric"
                                        />
                                        <Pressable
                                            onPress={() => changeModalUfVisibility(true)}
                                        >
                                            <View pointerEvents="none">
                                                <FormInput
                                                    className="mt-6"
                                                    cursor="#fff"
                                                    title="Estado"
                                                    onChangeText={handleChange('ufCliente')}
                                                    onBlur={() => setFieldTouched('ufCliente')}
                                                    value={values.ufCliente = selectedUf}
                                                    isValid={isValid}
                                                    editable={false}
                                                    errors={errors.ufCliente}
                                                    touched={touched.ufCliente}
                                                    // onTouchStart={() => changeModalUfVisibility(true)}
                                                    placeholder="Selecione uma opção"
                                                />
                                            </View>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => handleLoadCidade(true)}
                                        >
                                            <View pointerEvents="none">
                                                <FormInput
                                                    className="mt-6"
                                                    cursor="#fff"
                                                    title="Cidade"
                                                    onChangeText={handleChange('cidadeCliente')}
                                                    onBlur={() => setFieldTouched('cidadeCliente')}
                                                    value={values.cidadeCliente = selectedCity}
                                                    isValid={isValid}
                                                    editable={false}
                                                    errors={errors.cidadeCliente}
                                                    touched={touched.cidadeCliente}
                                                    // onTouchStart={() => changeModalCityVisibility(true)}
                                                    placeholder="Selecione uma opção"
                                                />
                                            </View>

                                        </Pressable>

                                        <FormInput
                                            className="mt-6"
                                            title="Celular"
                                            onChangeText={handleChange('celularCliente')}
                                            onBlur={() => setFieldTouched('celularCliente')}
                                            value={maskCelular(values.celularCliente)}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.celularCliente}
                                            touched={touched.celularCliente}
                                            maxLength={16}
                                            keyboarType="numeric"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="E-mail"
                                            onChangeText={handleChange('emailCliente')}
                                            onBlur={() => setFieldTouched('emailCliente')}
                                            value={values.emailCliente}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.emailCliente}
                                            touched={touched.emailCliente}
                                            keyboarType="email-address"
                                            autoCapitalize="none"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Data de nascimento"
                                            onChangeText={handleChange('nascimentoCliente')}
                                            onBlur={() => setFieldTouched('nascimentoCliente')}
                                            value={maskDate(values.nascimentoCliente)}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.nascimentoCliente}
                                            touched={touched.nascimentoCliente}
                                            maxLength={10}
                                            keyboarType="numeric"
                                        />
                                        <TouchableOpacity
                                            style={shadowForm}
                                            className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} m-5 py-4 px-24 rounded-full`}
                                            onPress={handleSubmit as any}
                                        >
                                            <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Continuar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </Formik>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </AppLayout>
        </Fragment>
    )
}

export default RegisterUser;