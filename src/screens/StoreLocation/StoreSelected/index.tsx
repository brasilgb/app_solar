import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform, Animated, Linking } from "react-native";
import { AppHeader } from "../../../components/Headers";
import { useNavigation } from '@react-navigation/native';
import AppLayout from "../../../layouts/AppLayout";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../components/Constant";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
interface StoreSelectedProps {
  route: any;
}
const StoreSelected = ({ route }: StoreSelectedProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { data } = route.params;
  const mapRef = useRef<any>();
  const [initialRegion, setInitialRegion] = useState({
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034
  });

  return (
    <AppLayout bgColor="bg-solar-gray-light" >
      <AppHeader
        auxClasses={`bg-solar-blue-light pb-1 ${Platform.OS === 'ios' ? '' : 'pt-1'}`}
        iconLeft={<MaterialIcons name="arrow-back-ios" color={"white"} size={26} onPress={() => navigation.navigate('CustomerLocation')} />}
        logo={true}
      />

      <View className="flex-1 w-full bg-solar-gray-light ">

        <View className="flex-1">
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            className="flex-1"
            initialRegion={initialRegion}
            showsUserLocation
            loadingEnabled
          >
            <Marker
              coordinate={{
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
              }}
            >
              <Animated.View className="items-center justify-center w-12 h-12">
                <Animated.Image
                  source={require('../../../../assets/map_marker.png')}
                  className="w-12 h-12"
                  resizeMode="cover"
                />
              </Animated.View>
            </Marker>
          </MapView>
        </View>

        <View className="px-2 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-Roboto_400Regular text-solar-blue-dark ml-2">{data.cidade}</Text>
            <Text className="text-lg font-Roboto_400Regular text-solar-yellow-dark ml-2">{data.distancia}</Text>
          </View>
          <Text className="text-lg font-Roboto_400Regular text-gray-600 ml-2">{data.endereco}</Text>
          <Text className="text-lg font-Roboto_400Regular text-gray-600 ml-2">{data.email}</Text>
          <Text className="text-lg font-Roboto_400Regular text-solar-blue-dark ml-2">{data.telefone}</Text>
        </View>

        <View className="flex-1 px-4">
          <View className="border-t border-gray-400 py-8 px-2">
            <TouchableOpacity
              className="flex-row items-center justify-start "
              onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${data.latitude},${data.longitude}`)}
            >
              <FontAwesome5 name="route" color="#154295" size={30} />
              <Text className="text-lg font-Roboto_400Regular text-solar-blue-dark ml-2">Traçar rota</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`flex-row items-center justify-between bg-solar-orange-middle px-4 ${Platform.OS === 'ios' ? 'pt-4 pb-14' : 'py-4'}`}>
          <View><Text className="text-lg font-Roboto_400Regular text-white">Ligar para a loja</Text></View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel: ${data.telefone}`)}
          >
            <MaterialIcons name="phone-in-talk" color={"white"} size={26} />
          </TouchableOpacity>
        </View>
      </View>

    </AppLayout>
  )
}

export default StoreSelected;