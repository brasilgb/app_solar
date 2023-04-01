import React, { Fragment, useContext } from "react";
import { View, Text, Platform, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
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
import { AuthContext } from "../../../contexts/auth";
import AppLoading from "../../../components/AppLoading";
import FormInput from "../../../components/FormInput";

interface ValuesForm {
    cpfcnpj: string;
}

const SignIn = () => {

    const { setLoading, loading, signIn } = useContext(AuthContext);

    const formatCpfCnpj = ((num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    })

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
                    //iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                    logo={true}
                />

                <KeyboardAvoidingView className="flex-1 items-center justify-start w-full">
                    <Text className="text-2xl font-Poppins_400Regular text-solar-blue-dark my-7">Antes de continuarmos...</Text>
                    <Text className="text-base font-Poppins_400Regular text-solar-blue-dark">Informe seu CPF ou CNPJ</Text>

                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            cpfcnpj: ''
                        }}
                        enableReinitialize={true}
                        onSubmit={(values: ValuesForm) => {
                            Keyboard.dismiss();
                            setLoading(true);

                            setTimeout(() => {
                                signIn({ cpfcnpj: values.cpfcnpj });
                                setLoading(false);
                            }, 500)
                        }}
                    >
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View className="pt-4 w-full px-4">
                                <FormInput
                                        className="mt-6"
                                        title="CPF ou CNPJ"
                                        onChangeText={handleChange('cpfcnpj')}
                                        onBlur={() => setFieldTouched('cpfcnpj')}
                                        value={formatCpfCnpj(values.cpfcnpj)}
                                        isValid={isValid}
                                        editable={true}
                                        errors={errors.cpfcnpj}
                                        touched={touched.cpfcnpj}
                                        autoCapitalize="none"
                                        keyboarType="numeric"
                                    />
                                <TouchableOpacity
                                        disabled={!isValid}
                                        style={shadowForm}
                                        className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} m-5 py-4 px-24 rounded-full`}
                                        onPress={handleSubmit as any}
                                    >
                                        <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Continuar</Text>
                                    </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </KeyboardAvoidingView>
            </AppLayout>
        </Fragment>
    )
}

export default SignIn;