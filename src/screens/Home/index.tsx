import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, StyleSheet, Image, Platform, Linking } from "react-native";
import AppLayout from "../../layouts/AppLayout";
import { Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import serviceapp from "../../services/serviceapp";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { AppHeader } from "../../components/Headers";
import { ButtomsFooter } from "../../components/Buttoms";
import { AppFooter } from "../../components/Footers";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackPrams";
import { AuthContext } from "../../contexts/auth";
import { URL_DATA } from "../../Constants"
export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1)
interface Props {
  item: any;
  index: any;
}
const Home = () => {
  const { signed } = useContext(AuthContext);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);
  const [carrocelData, setCarrocelData] = useState<any>([]);

  useEffect(() => {
    async function getLocationLojas() {
      await serviceapp.get(`${URL_DATA}(WS_CARROCEL_PROMOCAO)`)
        .then((response) => {
          setCarrocelData(response.data.resposta.data.carrocel);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationLojas();
  }, []);

  let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#00AEEF';
  const handlePressButtonAsync = async (url: any) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colorBar,
      controlsColor: "#FFF"
    });
  };

  const CarouselCardItem = ({ item, index }: Props) => {
    return (
      <View key={index} style={[styles.container, { backgroundColor: '#ebebeb' }]}>
        <View style={{ borderTopWidth: 1, borderTopColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#FFF' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handlePressButtonAsync(item.carLink)}
          >
            <Image
              source={{ uri: item.carLinkImagem }}
              style={styles.image}
            />
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  return (
    <AppLayout bgColor="bg-solar-blue-light" statusBarBG="#00AEEF" statusBarStyle="light" >

      <AppHeader
        auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
        iconLeft={<Ionicons name="ios-menu" color={"white"} size={40} onPress={() => navigation.navigate('SideBar')} />}
        iconRight={<MaterialIcons name="message" color={"white"} size={40} onPress={() => navigation.navigate("ContactUs")} />}
        logo={true}
      />

      <View className="flex-1 w-full bg-solar-gray-dark">
        <Text allowFontScaling={false} className="bg-solar-blue-light text-sm font-Poppins_500Medium text-white text-center py-3">Olá, seja bem vindo!</Text>
        <View style={{ flex: 1, padding: 0, margin: 0 }}>
          <Carousel
            layout="default"
            vertical={false}
            layoutCardOffset={9}
            ref={isCarousel}
            data={carrocelData}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={(index: any) => setIndex(index)}
            autoplay={true}
            autoplayDelay={1000}
            autoplayInterval={6000}
            inactiveSlideScale={1}
          />
        </View>
        <View>
          <Pagination
            dotsLength={carrocelData?.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotContainerStyle={{
              height: 0,
              padding: 0,
              margin: 0
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: 'rgb(3, 170, 247)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
            containerStyle={{
              height: 10,
              padding: 0,
              margin: 0,
              backgroundColor: '#FAFAFA'
            }}

          />
        </View>
      </View>

      <AppFooter>
        <View className="flex-row border-b-[5px] border-solar-orange-dark pb-3 pl-[3.5px] bg-solar-gray-light">
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <ButtomsFooter
              onPress={() => handlePressButtonAsync('https://www.lojasolar.com.br/')}
              textButtom="Comprar"
              iconButtom={<MaterialCommunityIcons name="basket-plus-outline" color={"white"} size={30} />}
            />
            <ButtomsFooter
              onPress={() => navigation.navigate("NoRegistry", {data: '28064375045'})}
              textButtom="Pagamentos"
              iconButtom={<MaterialCommunityIcons name="barcode" color={"white"} size={30} />}
            />
            <ButtomsFooter
              textButtom="2. Via Boleto"
              iconButtom={<AntDesign name="barcode" color={"white"} size={30} />}
            />
            <ButtomsFooter
              onPress={() => navigation.navigate("CustomerLocation", { data: false })}
              textButtom="Lojas"
              iconButtom={<Entypo name="location-pin" color={"white"} size={30} />}
            />
            <ButtomsFooter
              textButtom="Assistência"
              iconButtom={<Entypo name="tools" color={"white"} size={30} />}
            />
            <ButtomsFooter
              onPress={() => navigation.navigate("ContactUs")}
              textButtom="Fale Conosco"
              iconButtom={<MaterialIcons name="message" color={"white"} size={30} />}
            />
            <ButtomsFooter
              textButtom="Meu Histórico"
              iconButtom={<MaterialCommunityIcons name="cart-check" color={"white"} size={30} />}
            />
          </ScrollView>
        </View>
      </AppFooter>

    </AppLayout>

  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //   backgroundColor: 'white',
    borderRadius: 0,
    width: ITEM_WIDTH,
    // paddingBottom: 0,
    // paddingTop: 0,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: 450,
    header: {
      // color: "#222",
      // fontSize: 28,
      // fontWeight: "bold",
      // paddingLeft: 20,
      // paddingTop: 20
    }
  }
});