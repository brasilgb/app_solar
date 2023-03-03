import React from "react";
import { View, Text, Platform, KeyboardAvoidingView, TextInput } from "react-native";
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
interface ValuesForm {
    cpfcnpj: string;
}

const CheckPassword = () => {

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
                        console.log(values);
                    }}
                >
                    {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                        <View className="flex items-center justify-start pt-4 w-full px-4">
                            <Text className="w-full  pl-8 text-gray-500 font-Poppins_500Medium">CPF ou CNPJ</Text>
                            <TextInput
                                style={shadowForm}
                                className={`w-full py-4 px-8 rounded-full text-lg font-Poppins_400Regular bg-white border ${!isValid ? "text-red-600 border-red-600" : "text-solar-blue-dark border-gray-300"}`}
                                onChangeText={handleChange('cpfcnpj')}
                                onBlur={() => setFieldTouched('cpfcnpj')}
                                autoCorrect={false}
                                keyboardType='numeric'
                                maxLength={18}
                                value={formatCpfCnpj(values.cpfcnpj)}
                            />
                            {touched.cpfcnpj && errors.cpfcnpj &&
                                <Text className="self-end pr-6 pt-1 text-xs text-red-600 font-Poppins_400Regular_Italic">{errors.cpfcnpj}</Text>
                            }
                            <TouchableOpacity
                                disabled={!isValid}
                                onPress={handleSubmit as any}
                                style={shadowForm}
                                className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-yellow-dark"} mt-5 py-4 px-24 rounded-full`}
                            >
                                <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

            </KeyboardAvoidingView>

        </AppLayout>
    )
}

export default CheckPassword;