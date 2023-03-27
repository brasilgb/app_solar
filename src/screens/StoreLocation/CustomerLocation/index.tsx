import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, Platform, View, Animated, Dimensions, TouchableOpacity } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import { shadowAll } from "../../../Styles";
import { AuthContext } from "../../../contexts/auth";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../Constants";

const { width, height } = Dimensions.get("window");

export const HEIGHT = Dimensions.get('window').height;
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const CARD_WIDTH = width * 0.8;
interface ListCitiesProps {
  item: any;
  index: any;
}

const CustomerLocation = ({ route }: any) => {

  const { data } = route?.params;

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
      let lojas = data ? 'WS_CARREGA_LOJAS' : 'WS_LOJAS_PROXIMA';
      let latitudel = parseFloat(positionGlobal[0]);
      let longitudel = parseFloat(positionGlobal[1]);
      await serviceapp.get(`${URL_DATA}(${lojas})?latitude=${latitudel}&longitude=${longitudel}`)
        .then((response) => {
          if (data) {
            let result = response.data.resposta.data.filter((l: any) => (l.cidade.split("-")[0] === data.split("-")[0] && l.latitude !== "" && l.longitude !== ""))
            setLocationLojasProxima(result);
            const { latitude, longitude } = result[0];
            setTimeout(() => {
              const setregion = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034
              };
              if (mapRef.current) {
                mapRef.current.animateToRegion(setregion, 300);
              }
            }, 1000);
          } else {
            setLocationLojasProxima(response.data.resposta.data);
          }

        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationLojasProxima();
  }, [location, data]);

  const renderItem = ({ item, index }: ListCitiesProps) =>
  (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('StoreSelected', { data: item })}
    >
      <View key={index} className="bg-solar-gray-middle m-2 border border-white rounded-lg" style={shadowAll}>
        <View className="p-4">
          <Text allowFontScaling={false} numberOfLines={1} className="text-base text-solar-blue-dark font-Poppins_700Bold pb-1.5">{item.cidade}</Text>
          <Text allowFontScaling={false} numberOfLines={1} className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5">{item.endereco}</Text>
          <Text allowFontScaling={false} numberOfLines={1} className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5">{item.email}</Text>
        </View>
        <View className="flex-row items-center justify-between bg-solar-gray-dark px-2 pt-2 border-t border-white">
          <Text allowFontScaling={false} numberOfLines={1} className="text-base text-solar-blue-dark font-Poppins_500Medium pb-1.5">{item.telefone}</Text>
          <Text allowFontScaling={false} numberOfLines={1} className="text-base text-solar-yellow-dark font-Poppins_500Medium pb-1.5">{item.distancia}</Text>
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
    <AppLayout bgColor="bg-solar-gray-light" statusBarBG="#00AEEF" statusBarStyle="light">

      <AppHeader
        auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-0'}`}
        iconLeft={<Ionicons name="ios-menu" color={"white"} size={40} onPress={() => navigation.navigate('SideBar')} />}
        iconRight={<FontAwesome5 name="list-alt" color={"white"} size={40} onPress={() => navigation.navigate('CustomerLocationList', { data: locationLojasProxima })} />}
        logo={true}
      />
      <View className="flex-1">
        <View className="flex-col items-center">
          <View className="pt-2">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-2xl text-solar-blue-dark">Lojas mais próximas</Text>
          </View>
          <View className="py-2">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-base text-solar-blue-dark">Encontre a loja Solar mais próxima de você</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-solar-blue-light w-full">

          <View className="pl-3">
            <Entypo name="location-pin" color={"white"} size={24} />
          </View>
          <View className="flex-grow items-start justify-between py-1 pl-3 h-14">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-xs text-white">Sua Localização</Text>
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-base text-white">{data ? data.split(" - ")[0] : ''}</Text>
          </View>

          <View className="pr-4">
            <TouchableOpacity
              className="rounded-3xl py-2 px-4 bg-yellow-500"
              style={shadowAll}
              onPress={() => navigation.navigate("CustomerCitiesList")}
            >
              <Text allowFontScaling={false} className="font-Poppins_500Medium text-sm text-solar-blue-dark">Alterar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1">
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
        </View>

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