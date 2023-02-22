import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator, CardStyleInterpolators, StackHeaderProps, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator<RootStackParamList>();
import Home from "../screens/Home";
import { CustomerLocation, StoreSelected, CustomerLocationList, CustomerCitiesList } from "../screens/StoreLocation";
import { RootStackParamList } from "../screens/RootStackPrams";
import { SideBar, ContactUs, CommonQuestions } from "../screens/UserActions";

interface NavigationProps {
    header?: ((props: StackHeaderProps) => React.ReactNode) | undefined;
}
const AppRoutes = () => {

    return (
        <Stack.Navigator
            initialRouteName="Home"
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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SideBar" component={SideBar} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CustomerLocation" component={CustomerLocation} options={{ gestureEnabled: false, headerMode: "screen" }} />
            <Stack.Screen name="StoreSelected" component={StoreSelected} options={{ gestureEnabled: false, headerMode: "screen" }} />
            <Stack.Screen name="CustomerLocationList" component={CustomerLocationList} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CustomerCitiesList" component={CustomerCitiesList} options={{ gestureEnabled: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
            <Stack.Screen name="ContactUs" component={ContactUs} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CommonQuestions" component={CommonQuestions} options={{ gestureEnabled: false }} />
            </Stack.Navigator>
    )
}

export default AppRoutes;