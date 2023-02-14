import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, Platform, View, StyleSheet, Animated, Dimensions } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import { shadowAll } from "../../../Styles";
import { AuthContext } from "../../../contexts/auth";
import serviceapp from "../../../services/serviceapp";

const { width, height } = Dimensions.get("window");

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8)
const CARD_WIDTH = width * 0.8;
interface ListCitiesProps {
  item: any;
  index: any;
}

const CustomerLocation = () => {
  const { positionGlobal } = useContext(AuthContext);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState<[any, any]>([0, 0]);
  const [locationLojasProxima, setLocationLojasProxima] = useState<any>([]);
  const mapRef = useRef<any>();
  let mapAnimation = new Animated.Value(0);
  const [region, setRegion] = useState(
    {
      latitude: positionGlobal[0],
      longitude: positionGlobal[1],
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0034
    }
  )

  useEffect(() => {
    async function getLocationLojasProxima() {
      await serviceapp.get(`http://services.gruposolar.com.br:8082/servicecomercial/servlet/(WS_LOJAS_PROXIMA)?latitude=${positionGlobal[0]}&longitude=${positionGlobal[1]}`)
        .then((response) => {
          setLocationLojasProxima(response.data.resposta.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationLojasProxima();
  }, [location]);


  const renderItem = ({ item, index }: ListCitiesProps) =>
  (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('StoreSelected', { data: item })}
    >
      <View key={index} className="bg-solar-gray-middle m-2 border border-white rounded-lg" style={shadowAll}>
        <View className="p-4">
          <Text numberOfLines={1} className="text-base text-solar-blue-dark font-Roboto_700Bold pb-1.5">{item.cidade}</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500 font-Roboto_400Regular pb-1.5">{item.endereco}</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500 font-Roboto_400Regular pb-1.5">{item.email}</Text>
        </View>
        <View className="flex-row items-center justify-between bg-solar-gray-dark px-2 pt-2 border-t border-white">
          <Text numberOfLines={1} className="text-base text-solar-yellow-dark font-Roboto_700Bold pb-1.5">{item.telefone}</Text>
          <Text numberOfLines={1} className="text-base text-solar-yellow-dark font-Roboto_700Bold pb-1.5">{item.distancia}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onCaroucelItemChange = (index: any) => {

    const { latitude, longitude } = locationLojasProxima[index];

    const setregion = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0034
    };
    if (mapRef.current) {
      mapRef.current.animateToRegion(setregion, 300);
    }
  }

  const interpolations = locationLojasProxima.map((marker: any, index: any) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });


  return (
    <AppLayout bgColor="bg-solar-gray-light">

      <AppHeader
        auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-0'}`}
        iconLeft={<Ionicons name="ios-menu" color={"white"} size={40} onPress={() => navigation.navigate('SideBar')} />}
        iconRight={<FontAwesome5 name="list-alt" color={"white"} size={40} />}
        logo={true}
      />
      <View className="flex-col">
        <View className="flex-col items-center">
          <View className="pt-2">
            <Text className="font-Roboto_400Regular text-2xl text-solar-blue-dark">Lojas mais próximas</Text>
          </View>
          <View className="py-2">
            <Text className="font-Roboto_400Regular text-base text-solar-blue-dark">Encontre a loja Solar mais próxima de você</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-solar-blue-light w-full">

          <View className="flex-none pl-3">
            <Entypo name="location-pin" color={"white"} size={24} />
          </View>
          <View className="flex-grow items-start justify-between py-1 pl-3 h-14">
            <Text className="font-Roboto_400Regular text-xs text-white">Sua Localização</Text>
            <Text className="font-Roboto_400Regular text-base text-white">LOCALIZAÇÂO</Text>
          </View>

          <View className="flex-none pr-4">
            <TouchableOpacity
              className="rounded-3xl py-2 px-4 bg-yellow-500"
              style={shadowAll}
            >
              <Text className="font-Roboto_500Medium text-sm text-solar-blue-dark">Alterar</Text>
            </TouchableOpacity>
          </View>

        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          className="flex-1"
          initialRegion={region}
          showsUserLocation
          loadingEnabled
        >
          {locationLojasProxima.map((marker: any, index: any) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <Marker key={index}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
              >
                <Animated.View className="items-center justify-center w-14 h-14">
                  <Animated.Image
                    source={require('../../../../assets/map_marker.png')}
                    style={[scaleStyle]}
                    className="w-5 h-5"
                    resizeMode="cover"
                  />
                </Animated.View>
              </Marker>
            )
          })}
        </MapView>

        <View className="absolute bottom-16">
          <Carousel
            layout={'default'}
            vertical={false}
            layoutCardOffset={9}
            data={locationLojasProxima}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={(index) => onCaroucelItemChange(index)}
            autoplay={false}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            callbackOffsetMargin={5}
          />
        </View>

      </View>
    </AppLayout >
  )
}

export default CustomerLocation;