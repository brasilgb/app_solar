import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, Platform, FlatList, TextInput, TouchableOpacity } from "react-native";
import { AppHeader } from "../../../components/Headers";
import AppLayout from "../../../layouts/AppLayout";
import { RootStackParamList } from "../../RootStackPrams";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import serviceapp from "../../../services/serviceapp";
import { URL_DATA } from "../../../constants";

interface CitiesProps {
  item: any;
  index: any;
}

const CustomerCitiesList = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');
  const [masterData, setMasterData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function getLocationLojas() {
      await serviceapp.get(`(WS_CARREGA_LOJAS)`)
        .then((response) => {
          // const CordinateEmpty = response.data.resposta.data.filter((city:any) => (city.latitude !== "" && city.longitude !== ""));
        
          setMasterData(response.data.resposta.data.map((c: any) => c.cidade).filter((value: any, index: any, self: any) => self.indexOf(value) === index));
          setFilteredData(response.data.resposta.data.map((c: any) => c.cidade).filter((value: any, index: any, self: any) => self.indexOf(value) === index));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationLojas();
  }, []);

  const RenderCities = ({ item, index }: CitiesProps) => (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.navigate('CustomerLocation', { data: item })}
    >
      <View className="flex-row border-t border-gray-400 py-3.5 px-2.5">
        <View>
          <Text allowFontScaling={false} className="text-sm font-Poppins_400Regular text-gray-600">{item.split(" - ")[0]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const searchFilter = (text: any) => {
    if (text) {
      const newData = masterData.filter(
        function (item: any) {
          if (item) {
            const itemData = item.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  return (
    <AppLayout bgColor="bg-solar-gray-dark">
      <AppHeader
        auxClasses={`bg-solar-gray-dark ${Platform.OS === 'ios' ? '' : 'pt-0'}`}
        iconLeft={<Text allowFontScaling={false} className="text-sm text-gray-600">Selecione uma opção ok</Text>}
        iconRight={<MaterialCommunityIcons name="close" color={"#F18800"} size={40} onPress={() => navigation.pop()} />}
        logo={false}
      />

      <View className="flex-row bg-[#dad8d8] items-center justify-center py-2.5 px-3.5">

        <View className="w-full flex-row items-center justify-start bg-solar-gray-dark rounded-full pl-3">
          <MaterialIcons className="" name="search" size={32} color="#024D9F" onPress={() => navigation.goBack()} />
          <TextInput
            className=" py-3 pl-1 text-[18px] text-gray-600 font-Poppins_500Medium w-full"
            onChangeText={(text) => searchFilter(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Buscar cidade"
          />
        </View>

      </View>

      <View className="flex-1 w-full  mt-12">
        <FlatList
          horizontal={false}
          data={filteredData}
          keyExtractor={(item: any, index: number) => (item + index)}
          renderItem={({ item }) => <RenderCities item={item} index={undefined} />}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </AppLayout>
  )
}

export default CustomerCitiesList;