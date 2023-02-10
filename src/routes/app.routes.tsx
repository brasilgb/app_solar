import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Home from "../screens/Home";
import SideBar from "../screens/UserActions/Sidebar";
import { CustomerLocation } from "../screens/StoreLocation";

const AppRoutes = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                presentation: 'transparentModal',
                animationEnabled: true,
                cardShadowEnabled: true,
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Sidebar" component={SideBar} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CustomerLocation" component={CustomerLocation} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
    )
}

export default AppRoutes;