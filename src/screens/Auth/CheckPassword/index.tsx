import React, { Fragment, useCallback, useContext, useState } from "react";
import { View, Text, Platform, KeyboardAvoidingView, Alert, Keyboard } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import { shadowForm } from "../../../Styles";
import schema from "./schema";
import { cnpj, cpf } from 'cpf-cnpj-validator';
import FormInput from "../../../components/FormInput";
import Checkbox from "expo-checkbox";
import { AuthContext } from "../../../contexts/auth";
import { URL_DATA } from "../../../constants";
import serviceapp from "../../../services/serviceapp";
import AppLoading from "../../../components/AppLoading";
interface ValuesForm {
    senha: string;
}

const CheckPassword = ({ route }: any) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { data } = route.params;
    const formatCpfCnpj = ((num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    })
    const { checkPasswordApp, setLoading, loading } = useContext(AuthContext);
    const [isChecked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onsubmit = (values: any) => {
        Keyboard.dismiss();
        setLoading(true);
        setTimeout(async () => {
             await checkPasswordApp({ cpfcnpj: data.cpfCnpj, senha: values.senha, nomeCliente: data.nomeCliente, connected: isChecked });
            setLoading(false);
        }, 500)
    }

    const handlePassword = (cpfCnpj: any) => {
        Alert.alert(
            'Atenção',
            'Você deseja recuperar sua senha?',
            [
                { text: 'Sim', onPress: () => resetPassword(cpfCnpj) },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    }

    const resetPassword = useCallback(async (cpfCnpj: any) => {
        setLoading(true);
        const response = await serviceapp.get(`${URL_DATA}(WS_RECUPERA_SENHA)?cpfcnpj=${cpfCnpj}`);
        const { success, message, data } = response.data.resposta;
        if (!success) {
            Alert.alert('Atenção', message);
            return;
        }
        navigation.navigate('PasswordAltered', { data: data.email });
        setLoading(false);
    }, []);

    return (
        <Fragment>
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
                    iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <KeyboardAvoidingView className="flex-1 items-center justify-start w-full">
                    <Text className="text-2xl font-Poppins_400Regular text-solar-blue-dark my-7">Faça seu login</Text>
                    <Text className="text-base font-Poppins_400Regular text-solar-blue-dark">{formatCpfCnpj(data.cpfCnpj)}</Text>

                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            senha: ''
                        }}
                        enableReinitialize={true}
                        onSubmit={onsubmit}
                    >
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View className="w-full px-4">

                                <FormInput
                                    className="mt-6"
                                    title="Senha"
                                    onChangeText={handleChange('senha')}
                                    onBlur={() => setFieldTouched('senha')}
                                    value={values.senha}
                                    isValid={isValid}
                                    editable={true}
                                    errors={errors.senha}
                                    touched={touched.senha}
                                    autoCapitalize="none"
                                    secureTextEntry={showPassword ? false : true}
                                    iconSecurity={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    actionSecurity={() => setShowPassword(!showPassword)}
                                />
                                <View className="flex-row items-center justify-between mt-8 mb-4 px-3">
                                    <View className="flex-row items-center justify-between">
                                        <Checkbox
                                            className="h-6 w-6"
                                            value={isChecked}
                                            onValueChange={setChecked}
                                            color={isChecked ? '#ffaf64' : undefined}
                                        />
                                        <Text className="ml-2" onPress={() => setChecked(!isChecked)}>Continuar logado</Text>
                                    </View>
                                    <Text className="text-[#fa9908] underline" onPress={() => handlePassword(data.cpfCnpj)}>Esqueci minha senha</Text>
                                </View>
                                <TouchableOpacity
                                    disabled={!isValid}
                                    onPress={handleSubmit as any}
                                    style={shadowForm}
                                    className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} m-5 py-4 px-24 rounded-full`}
                                >
                                    <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Entrar</Text>
                                </TouchableOpacity>

                            </View>
                        )}
                    </Formik>

                </KeyboardAvoidingView>

            </AppLayout>
        </Fragment>
    )
}

export default CheckPassword;