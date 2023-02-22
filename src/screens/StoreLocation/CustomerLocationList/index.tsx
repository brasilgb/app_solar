import React from "react";
import { View, Text, Platform } from "react-native";
import AppLayout from "../../../layouts/AppLayout";
import { AppHeader } from "../../../components/Headers";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackPrams";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { shadowAll } from "../../../Styles";

interface Props {
  item: any;
  index: any;
}


const CustomerLocationList = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { data } = route?.params;

  const renderItem = ({ item, index }: Props) => {
    return (

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('StoreSelected', { data: item })}>
        <View key={index} style={shadowAll} className="bg-solar-gray-dark m-2.5 border border-white rounded-lg">
          <View className="p-2">
            <Text allowFontScaling={false} className="text-[18px] font-Poppins_500Medium text-solar-blue-dark pb-3">{item.cidade}</Text>
            <Text allowFontScaling={false} className="text-[16px] font-Poppins_500Medium text-gray-600">{item.endereco}</Text>
            <Text allowFontScaling={false} className="text-[14px] font-Poppins_500Medium text-gray-600">{item.email}</Text>
          </View>
          <View className="flex-row justify-between mt-3 bg-solar-gray-middle p-2.5 border-t border-white">
            <Text allowFontScaling={false} className="text-sm font-Poppins_500Medium text-solar-blue-dark">{item.telefone}</Text>
            <Text allowFontScaling={false} className="text-sm font-Poppins_500Medium text-solar-orange-dark">{item.distancia}</Text>
          </View>
        </View>
      </TouchableOpacity>

    );
  }

  return (
    <AppLayout bgColor="bg-solar-gray-light" statusBarBG="#00AEEF" statusBarStyle="light">
      <AppHeader
        auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-0'}`}
        iconLeft={<Ionicons name="ios-menu" color={"white"} size={40} onPress={() => navigation.navigate('SideBar')} />}
        iconRight={<FontAwesome5 name="map-marked-alt" color={"white"} size={40} onPress={() => navigation.navigate('CustomerLocation', {data: false})} />}
        logo={true}
      />

      <View className="flex-1 pb-8">
        <View className="flex-col items-center">
          <View className="pt-2">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-2xl text-solar-blue-dark">Lojas mais próximas</Text>
          </View>
          <View className="py-2">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-base text-solar-blue-dark">Encontre a loja Solar mais próxima de você</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-solar-blue-light w-full">

          <View className="flex-none pl-3">
            <Entypo name="location-pin" color={"white"} size={24} />
          </View>
          <View className="flex-grow items-start justify-between py-1 pl-3 h-14">
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-xs text-white">Sua Localização</Text>
            <Text allowFontScaling={false} className="font-Poppins_400Regular text-base text-white">LOCALIZAÇÂO</Text>
          </View>

          <View className="flex-none pr-4">
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item, index) => (item.latitude + index)}
            renderItem={renderItem}
          />
        </View>
      </View>
    </AppLayout>
  )
}

export default CustomerLocationList;