import React, { Fragment } from "react";
import { Text, TextInput, View } from "react-native";
import { shadowForm } from "../../Styles";

interface FormProps {
    className?: String;
    onChangeText?: any;
    onBlur?: any;
    autoCapitalize?: any;
    title?: any;
    keyboarType?: any;
    maxLength?: number;
    value?: any;
    isValid?: any;
    editable?: any;
    errors?: any;
    touched?: any;
    onTouchStart?: any;
    showSoftInputOnFocus?: any;
    placeholder?: any;
    cursor?: any;
}

const FormInput = ({ className, cursor, onChangeText, onBlur, autoCapitalize, keyboarType, maxLength, value, title, isValid, editable, touched, errors, onTouchStart, showSoftInputOnFocus, placeholder }: FormProps) => {
    
    return (
        <Fragment>
            <View className={`${className}`} >
                <Text className="text-base pl-8 text-gray-400 font-Poppins_700Bold">{title}</Text>
                <TextInput
                    style={shadowForm}
                    className={`py-4 px-8 rounded-full text-lg font-Poppins_400Regular bg-white border placeholder:text-slate-400 ${touched && errors ? "text-red-600 border-red-600" : "text-solar-blue-dark border-gray-300"}`}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType={keyboarType}
                    maxLength={maxLength}
                    value={value.toUpperCase()}
                    editable={editable}
                    showSoftInputOnFocus={showSoftInputOnFocus}
                    placeholder={placeholder}
                    placeholderTextColor="#154295"
                    cursorColor={cursor}
                />
            </View>
            {touched && errors &&
                <Text className="self-end pr-6 pt-1 text-xs text-red-600 font-Poppins_400Regular_Italic">{errors}</Text>
            }
        </Fragment>
    )
}

export default FormInput;