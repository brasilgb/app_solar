import { View, Text, Platform, KeyboardAvoidingView, ScrollView, Dimensions, Alert, Keyboard, TouchableOpacity, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import AppLayout from "../../../layouts/AppLayout";
import AppLoading from "../../../components/AppLoading";
import { AppHeader } from "../../../components/Headers";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../../../contexts/auth";
import { RootStackParamList } from "../../RootStackPrams";
import { Formik } from "formik";
import schema from "./schema";
import serviceapp from "../../../services/serviceapp";
import FormInput from "../../../components/FormInput";
import { shadowAll, shadowForm } from "../../../Styles";
import AppModal from "../../../components/AppModal";
import { number } from "yup";
import { cnpj, cpf } from "cpf-cnpj-validator";

interface RegisterUserProps {
    route: any;
}

interface CrediaryForm {
    nomeMae: string;
    sexo: string;
    escolaridade: string;
    localTrabalho: string;
    estadoCivil: string;
    nomeConjuge: string;
    cpfConjuge: string;
    profissao: string;
    renda: string;
}

interface Props {
    item: any;
    index: any;
}
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Crediary = ({ route }: RegisterUserProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = route?.params
    const { setLoading, loading, disconnect } = useContext(AuthContext);
    const [carregaCliente, setCarregaCliente] = useState<any>([]);
    const [carregaEscolaridade, setCarregaEscolaridade] = useState<any>([]);
    const [carregaEstadoCivil, setCarregaEstadoCivil] = useState<any>([]);
    const [sexoCliente, setSexoCliente] = useState<string>('');
    const [escolaridadeCliente, setEscolaridadeCliente] = useState<string>('Selecione uma opção');
    const [estadoCivilCliente, setEstadoCivilCliente] = useState<string>('Selecione uma opção');
    const [profissaoCliente, setProfissaoCliente] = useState<string>('Selecione uma opção');
    const [modalEscolaridadeVisible, setModalEscolaridadeVisible] = useState<boolean>(false);
    const [modalEstadoCivilVisible, setModalEstadoCivilVisible] = useState<boolean>(false);
    const [modalListListProfissaoVisible, setModalListProfissaoVisible] = useState<boolean>(false);
    const [condicionalEstadoCivil, setCondicionalEstadoCivil] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [masterData, setMasterData] = useState<any>([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        async function getCarregaCliente() {
            await serviceapp.get(`(WS_CARREGA_CLIENTE)?token=${user?.token}`)
                .then((result) => {

                    let { token, message, data } = result.data.resposta;
                    if (!token) {
                        Alert.alert(
                            'Atenção',
                            message,
                            [
                                { text: 'Ok', onPress: () => { navigation.popToTop(); disconnect() } }
                            ]
                        );
                    }
                    setCarregaCliente(data)
                    setSexoCliente(data.sexo);
                    setEscolaridadeCliente(data.escolaridade ? data.escolaridade : 'Selecione uma opção');//'Selecione uma opção'
                    setEstadoCivilCliente(data.estadoCivil ? data.estadoCivil : 'Selecione uma opção');
                    setProfissaoCliente(data.profissao ? data.profissao : 'Selecione uma opção');
                    setCondicionalEstadoCivil(data.estadoCivil === "Casado" ? true : false);
                }).catch((erro) => {
                    console.log(erro);
                })

        };
        getCarregaCliente();
    }, [])

    // envio do formulário
    const onSubmit = (async (values: CrediaryForm) => {
        Keyboard.dismiss();
        setLoading(true);
        const response = await serviceapp.post(`(WS_CREDIARIO_CLIENTE)`, {
            token: user?.token,
            nomeMae: values.nomeMae,
            sexo: sexoCliente,
            escolaridade: values.escolaridade,
            localTrabalho: values.localTrabalho,
            estadoCivil: values.estadoCivil,
            nomeConjuge: values.nomeConjuge,
            cpfConjuge: values.cpfConjuge,
            profissao: values.profissao,
            renda: values.renda
        });
        const { token, success, message } = response.data.resposta;

        if (!success) {
            Alert.alert('Erro', `${message}`);
            return;
        }

        if (!token) {
            Alert.alert(
                'Atenção',
                message,
                [
                    { text: 'Ok', onPress: () => { navigation.navigate('Home'); disconnect() } }
                ]
            );
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);

        navigation.navigate('LoadImages', { user: user.token });
    });

    // Modal profissao
    useEffect(() => {
        async function getCarregaEscolaridade() {
            await serviceapp.get(`(WS_ESCOLARIDADE)`)
                .then((result) => {
                    setCarregaEscolaridade(result.data.resposta.data)
                }).catch((erro) => {
                    console.log(erro);
                })
        };
        getCarregaEscolaridade();
    }, []);

    // Modal estado civil
    useEffect(() => {
        async function getCarregaEstadoCivil() {
            await serviceapp.get(`(WS_ESTADO_CIVIL)`)
                .then((result) => {
                    setCarregaEstadoCivil(result.data.resposta.data)
                }).catch((erro) => {
                    console.log(erro);
                })
        };
        getCarregaEstadoCivil();
    }, []);

    // Modal profissao
    useEffect(() => {
        async function getProfissaoCliente() {
            await serviceapp.get(`(WS_PROFISSAO)`)
                .then((response) => {
                    setMasterData(response.data.resposta.data.map((c: any) => c.profissao).filter((value: any, index: any, self: any) => self.indexOf(value) === index));
                    setFilteredData(response.data.resposta.data.map((c: any) => c.profissao).filter((value: any, index: any, self: any) => self.indexOf(value) === index));

                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getProfissaoCliente();
    }, []);

    const searchFilter = (text: any) => {
        if (text) {
            const newData = masterData.filter(
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
            setFilteredData(masterData);
            setSearch(text);
        }
    };

    const formatCpfCnpj = ((num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    })

    return (
        <>
            {/* Modal escolaridade */}
            <AppModal
                modalVisible={modalEscolaridadeVisible}
                onTouchEnd={() => setModalEscolaridadeVisible(false)}
            >
                <View className="pb-2" style={{ width: WIDTH - 20, height: HEIGHT - 150 }}>

                    <View className="flex-row items-center justify-between border-b border-b-gray-300">
                        <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">Selecione uma opção</Text>
                        <MaterialIcons name="close" size={30} color="#FAA335" onPress={() => setModalEscolaridadeVisible(false)} />
                    </View>

                    {carregaEscolaridade.map((esc: any, iesc: any) => (
                        <Pressable key={iesc}
                            onPress={() => { setEscolaridadeCliente(esc.escolaridade); setModalEscolaridadeVisible(!modalEscolaridadeVisible) }}
                        >
                            <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium"
                            >{esc.escolaridade}</Text>
                        </Pressable>
                    ))}

                </View>
            </AppModal>

            {/* Modal estado civil */}
            <AppModal
                modalVisible={modalEstadoCivilVisible}
                onTouchEnd={() => setModalEstadoCivilVisible(false)}
            >
                <View className="pb-2" style={{ width: WIDTH - 20, height: HEIGHT / 2 }}>

                    <View className="flex-row items-center justify-between border-b border-b-gray-300">
                        <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">Selecione uma opção</Text>
                        <MaterialIcons name="close" size={30} color="#FAA335" onPress={() => setModalEstadoCivilVisible(false)} />
                    </View>

                    {carregaEstadoCivil.map((ec: any, iec: any) => (
                        <Pressable key={iec}
                            onPress={() => { setEstadoCivilCliente(ec.estadoCivil); setModalEstadoCivilVisible(!modalEstadoCivilVisible) }}
                        >
                            <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium"
                            >{ec.estadoCivil}</Text>
                        </Pressable>
                    ))}

                </View>
            </AppModal>

            {/* Modal profissão cliente */}
            <AppModal
                modalVisible={modalListListProfissaoVisible}
                onTouchEnd={() => setModalListProfissaoVisible(false)}
            >
                <View className="pb-2" style={{ width: WIDTH - 20, height: HEIGHT - 50 }}>
                    <View className="flex-row items-center justify-between border-b border-b-gray-300">
                        <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">Selecione uma opção</Text>
                        <MaterialIcons name="close" size={30} color="#FAA335" onPress={() => setModalListProfissaoVisible(false)} />
                    </View>
                    <View className="bg-gray-400 border-y border-y-gray-100">
                        <View className="flex-row items-center justify-between my-2 mx-2 px-2 rounded-full bg-gray-50">
                            <MaterialIcons name="search" size={32} color="#024D9F" onPress={() => navigation.goBack()} />
                            <TextInput
                                className="bg-gray-50 rounded-full flex-1 text-base"
                                onChangeText={(text) => searchFilter(text)}
                                value={search}
                                underlineColorAndroid="transparent"
                                placeholder="Buscar profissão"
                            />
                        </View>
                    </View>

                    {loading
                        ? <View className="flex-1 items-center justify-center">
                            <ActivityIndicator
                                size="large"
                                color="#154295a2"
                                // className="bg-solar-blue-dark p-4 rounded-lg opacity-90"
                                style={shadowAll}
                            />
                        </View>
                        : <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                            {filteredData.map((pro: any, ipro: any) => (
                                <Pressable key={ipro}
                                    onPress={() => { setProfissaoCliente(pro); setModalListProfissaoVisible(!modalListListProfissaoVisible) }}
                                >
                                    <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium border-b border-gray-400"
                                    >{pro}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    }

                </View>
            </AppModal>

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
                    //iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />
                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={-14}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View className="mb-14 px-4">
                            <View className="flex-col items-center justify-start w-full my-4">
                                <Text allowFontScaling={false} className=" text-[28px] text-solar-blue-dark font-Poppins_400Regular p-4 text-left">
                                    Crediário
                                </Text>
                                <Text allowFontScaling={false} className="font-Poppins_500Medium text-base text-solar-blue-dark">
                                    Preencha o formulário
                                </Text>
                                <View className="flex-row items-center justify-start w-full my-4">
                                    <Feather name="alert-triangle" color={"#b1b1b1"} size={22} />
                                    <Text allowFontScaling={false} className="text-[12px] text-gray-400 font-Poppins_400Regular_Italic pt-1 pl-2 self-start">
                                        Todos os dados são obrigatórios
                                    </Text>
                                </View>
                            </View>

                            <Formik
                                validationSchema={schema}
                                initialValues={{
                                    nomeMae: carregaCliente.nomeMae,
                                    sexo: sexoCliente,
                                    escolaridade: carregaCliente.escolaridade,
                                    localTrabalho: carregaCliente.localTrabalho,
                                    estadoCivil: carregaCliente.estadoCivil,
                                    nomeConjuge: carregaCliente.nomeConjuge,
                                    cpfConjuge: carregaCliente.cpfConjuge,
                                    profissao: carregaCliente.profissao,
                                    renda: carregaCliente.renda,
                                }}
                                enableReinitialize
                                onSubmit={onSubmit}
                            >
                                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                                    <View className="w-full">

                                        <FormInput
                                            className="mt-2"
                                            title="Nome da mãe"
                                            onChangeText={handleChange('nomeMae')}
                                            onBlur={() => setFieldTouched('nomeMae')}
                                            value={values.nomeMae}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.nomeMae}
                                            touched={touched.nomeMae}
                                            autoCapitalize="characters"
                                        />

                                        <View className="mt-6">
                                            <Text className="text-base relative pl-8 text-gray-400 font-Poppins_700Bold">Qual o seu gênero?</Text>
                                            <View className="flex-row rounded-full items-center justify-center w-full border border-gray-200" style={shadowForm}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    className={`flex-1 items-center py-3 rounded-l-full border-r border-solar-blue-dark ${sexoCliente === 'Masculino' ? " bg-solar-yellow-dark" : " bg-gray-400"}`}
                                                    onPress={() => setSexoCliente('Masculino')}
                                                >
                                                    <Text className="text-lg text-solar-blue-dark font-semibold">Masculino</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    className={`flex-1 items-center py-3 rounded-r-full ${sexoCliente === 'Feminino' ? " bg-solar-yellow-dark" : " bg-gray-400"}`}
                                                    onPress={() => setSexoCliente('Feminino')}
                                                >
                                                    <Text className="text-lg text-solar-blue-dark font-semibold">Feminino</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Pressable
                                            onPress={() => setModalEscolaridadeVisible(true)}
                                        >
                                            <View pointerEvents="none">
                                                <FormInput
                                                    className="mt-6"
                                                    title="Escolaridade"
                                                    onChangeText={handleChange('escolaridade')}
                                                    onBlur={() => setFieldTouched('escolaridade')}
                                                    value={values.escolaridade = escolaridadeCliente ? escolaridadeCliente : values.escolaridade}
                                                    isValid={isValid}
                                                    editable={true}
                                                    errors={errors.escolaridade}
                                                    touched={touched.escolaridade}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </Pressable>

                                        <FormInput
                                            className="mt-6"
                                            title="Local de trabalho"
                                            onChangeText={handleChange('localTrabalho')}
                                            onBlur={() => setFieldTouched('localTrabalho')}
                                            value={values.localTrabalho}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.localTrabalho}
                                            touched={touched.localTrabalho}
                                            autoCapitalize="characters"
                                        />

                                        <Pressable
                                            onPress={() => setModalEstadoCivilVisible(true)}
                                        >
                                            <View pointerEvents="none">
                                                <FormInput
                                                    className="mt-6"
                                                    title="Estado civil"
                                                    onChangeText={handleChange('estadoCivil')}
                                                    onBlur={() => setFieldTouched('estadoCivil')}
                                                    value={values.estadoCivil = estadoCivilCliente ? estadoCivilCliente : values.estadoCivil}
                                                    isValid={isValid}
                                                    editable={true}
                                                    errors={errors.estadoCivil}
                                                    touched={touched.estadoCivil}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </Pressable>

                                        {estadoCivilCliente === 'Casado' &&
                                            <>
                                                <FormInput
                                                    className="mt-6"
                                                    title="Nome do conjuge"
                                                    onChangeText={handleChange('nomeConjuge')}
                                                    onBlur={() => setFieldTouched('nomeConjuge')}
                                                    value={values.nomeConjuge}
                                                    isValid={isValid}
                                                    editable={true}
                                                    errors={errors.nomeConjuge}
                                                    touched={touched.nomeConjuge}
                                                    autoCapitalize="characters"
                                                />

                                                <FormInput
                                                    className="mt-6"
                                                    title="CPF do conjuge"
                                                    onChangeText={handleChange('cpfConjuge')}
                                                    onBlur={() => setFieldTouched('cpfConjuge')}
                                                    value={formatCpfCnpj(values.cpfConjuge)}
                                                    isValid={isValid}
                                                    editable={true}
                                                    errors={errors.cpfConjuge}
                                                    touched={touched.cpfConjuge}
                                                    autoCapitalize="characters"
                                                    keyboarType="numeric"
                                                    maxLength={11}
                                                />
                                            </>
                                        }

                                        <Pressable
                                            onPress={() => setModalListProfissaoVisible(true)}
                                        >
                                            <View pointerEvents="none">
                                                <FormInput
                                                    className="mt-6"
                                                    title="Profissão"
                                                    onChangeText={handleChange('profissao')}
                                                    onBlur={() => setFieldTouched('profissao')}
                                                    value={values.profissao = profissaoCliente ? profissaoCliente : values.profissao}
                                                    isValid={isValid}
                                                    editable={true}
                                                    errors={errors.profissao}
                                                    touched={touched.profissao}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </Pressable>

                                        <FormInput
                                            className="mt-6"
                                            title="Renda"
                                            onChangeText={handleChange('renda')}
                                            onBlur={() => setFieldTouched('renda')}
                                            value={values.renda}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.renda}
                                            touched={touched.renda}
                                            autoCapitalize="characters"
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
        </>
    )
}

export default Crediary;