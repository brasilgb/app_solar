import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator, CardStyleInterpolators, StackHeaderProps, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator<RootStackParamList>();
import Home from "../screens/Home";
import { CustomerLocation, StoreSelected, CustomerLocationList, CustomerCitiesList } from "../screens/StoreLocation";
import { RootStackParamList } from "../screens/RootStackPrams";
import { SideBar, ContactUs, CommonQuestions, PrivacyPolicy, LoadCities, PrivacySettings } from "../screens/UserActions";
import { CheckPassword, NoRegistry, SignIn, RegisterUser, Registered, RegisterPassword, RegisteredStore, RegisterPasswordStore, PasswordChanged, PasswordAltered, AlterPassword } from "../screens/Auth";
import Disconnect from "../screens/Disconnect";
import MyAccount from "../screens/Auth/MyAccount";
import { Crediary, ImagesSent, LoadImages } from "../screens/Crediary";

const AppRoutes = () => {

    return (
        <Stack.Navigator
            initialRouteName="Disconnect"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                presentation: 'transparentModal',
                animationEnabled: true,
                cardShadowEnabled: true, transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                },
                headerStyleInterpolator: HeaderStyleInterpolators.forFade,
            }}>
            <Stack.Screen name="Home" component={Home} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Disconnect" component={Disconnect} options={{ gestureEnabled: false }} />
            <Stack.Screen name="SideBar" component={SideBar} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CustomerLocation" component={CustomerLocation} options={{ gestureEnabled: false, headerMode: "screen" }} />
            <Stack.Screen name="StoreSelected" component={StoreSelected} options={{ gestureEnabled: false, headerMode: "screen" }} />
            <Stack.Screen name="CustomerLocationList" component={CustomerLocationList} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CustomerCitiesList" component={CustomerCitiesList} options={{ gestureEnabled: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
            <Stack.Screen name="ContactUs" component={ContactUs} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CommonQuestions" component={CommonQuestions} options={{ gestureEnabled: false }} />
            <Stack.Screen name="PrivacyPolice" component={PrivacyPolicy} options={{ gestureEnabled: false }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CheckPassword" component={CheckPassword} options={{ gestureEnabled: false }} />
            <Stack.Screen name="NoRegistry" component={NoRegistry} options={{ gestureEnabled: false }} />
            <Stack.Screen name="RegisterUser" component={RegisterUser} options={{ gestureEnabled: false }} />
            <Stack.Screen name="LoadCities" component={LoadCities} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Registered" component={Registered} options={{ gestureEnabled: false }} />
            <Stack.Screen name="RegisterPassword" component={RegisterPassword} options={{ gestureEnabled: false }} />
            <Stack.Screen name="RegisteredStore" component={RegisteredStore} options={{ gestureEnabled: false }} />
            <Stack.Screen name="RegisterPasswordStore" component={RegisterPasswordStore} options={{ gestureEnabled: false }} />
            <Stack.Screen name="PasswordChanged" component={PasswordChanged} options={{ gestureEnabled: false }} />
            <Stack.Screen name="PasswordAltered" component={PasswordAltered} options={{ gestureEnabled: false }} />
            <Stack.Screen name="AlterPassword" component={AlterPassword} options={{ gestureEnabled: false }} />
            <Stack.Screen name="MyAccount" component={MyAccount} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Crediary" component={Crediary} options={{ gestureEnabled: false }} />
            <Stack.Screen name="LoadImages" component={LoadImages} options={{ gestureEnabled: false }} />
            <Stack.Screen name="ImagesSent" component={ImagesSent} options={{ gestureEnabled: false }} />
            <Stack.Screen name="PrivacySettings" component={PrivacySettings} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
    )
}

export default AppRoutes;