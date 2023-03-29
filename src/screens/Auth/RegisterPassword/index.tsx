import React, { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity, Keyboard, Alert } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import FormInput from "../../../components/FormInput";
import { Formik } from "formik";
import { shadowForm } from "../../../Styles";
import schema from "./schema";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../Constants";
import { unMask } from "../../../utils/masks";

interface SenhaProps {
    senha: string;
    repitaSenha: string;
}

const RegisterPassword = ({route}:any) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [showPassword1, setShowPassword1] = useState<boolean>(false);
    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const { data } = route?.params

    const passwordReg = useCallback(async (values: SenhaProps) => {
        console.log(values, data);
            await serviceapp.get(`${URL_DATA}(WS_ALTERAR_SENHA_APP)?cpfcnpj=${data}&senha=${values.senha}`)
            .then((response) => {
                const { success, message, data } = response.data.resposta;
                if (success) {
                    navigation.navigate("CheckPassword", { data: data });
                } else {
                    Alert.alert('Erro', message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    },[]);

    const onSubmit = (async (values: SenhaProps) => {
        Keyboard.dismiss();
        passwordReg(values);
    })

    return (
        <AppLayout
            bgColor="bg-solar-gray-light"
            statusBarBG="#FAFAFA"
            statusBarStyle="dark"
        >

            <AppHeader
                auxClasses={`bg-solar-gray-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                // iconLeft={<Ionicons name="ios-chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                // iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                logo={true}
            />
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={-14}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View className="mb-14 px-4">

                        <Text allowFontScaling={false} className="text-[28px] text-solar-blue-dark font-Poppins_400Regular py-5 text-center">Este é seu primeiro acesso!</Text>
                        <Text allowFontScaling={false} className="text-[18px] text-solar-blue-dark font-Poppins_500Medium py-5 text-center">Por favor, defina a senha que você irá utilizar sempre que fizer login no aplicativo ds lojas solar.</Text>
                        <View className="flex-row items-center justify-start w-full mb-8">
                            <Feather name="alert-triangle" color={"#b1b1b1"} size={22} />
                            <Text allowFontScaling={false} className="text-[14px] text-gray-400 font-Poppins_400Regular_Italic pt-1 pl-2 self-start">
                                Sua senha precisa ter, no mínimo 6 caracteres
                            </Text>
                        </View>
                        <Formik
                            validationSchema={schema}
                            initialValues={{
                                senha: '',
                                repitaSenha: ''
                            }}
                            onSubmit={onSubmit}
                        >

                            {({ handleChange, handleBlur, setValues, setFieldValue, handleSubmit, setFieldTouched, values, touched, errors, isValid }) => (

                                <View className="w-full">

                                        <FormInput
                                            className="mt-6"
                                            title="Insira sua nova senha"
                                            onChangeText={handleChange('senha')}
                                            onBlur={() => setFieldTouched('senha')}
                                            value={values.senha}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.senha}
                                            touched={touched.senha}
                                            autoCapitalize="none"
                                            secureTextEntry={showPassword1 ? false : true}
                                            iconSecurity={showPassword1 ? 'eye-outline' : 'eye-off-outline'}
                                            actionSecurity={() => setShowPassword1(!showPassword1)}
                                        />

                                        <FormInput
                                            className="mt-6 relative"
                                            title="Confirme sua nova senha"
                                            onChangeText={handleChange('repitaSenha')}
                                            onBlur={() => setFieldTouched('repitaSenha')}
                                            value={values.repitaSenha}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.repitaSenha}
                                            touched={touched.repitaSenha}
                                            autoCapitalize="none"
                                            secureTextEntry={showPassword2 ? false : true}
                                            iconSecurity={showPassword2 ? 'eye-outline' : 'eye-off-outline'}
                                            actionSecurity={() => setShowPassword2(!showPassword2)}
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
    )
}

export default RegisterPassword;