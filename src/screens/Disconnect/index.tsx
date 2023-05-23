import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackPrams";
import { AuthContext } from "../../contexts/auth";
import serviceapp from "../../services/serviceapp";
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';


const Disconnect = () => {
  const { user, disconnect } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  let connected = user?.connected;

  // Gera ID único do telefone

  useEffect(() => {
    const getUidDevice = (async () => {
      let uuid = uuidv4();
      let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
      //if user has already signed up prior
      if (fetchUUID) {
        uuid = fetchUUID
      }
      await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuid));
      // console.log(uuid)
    });
    getUidDevice();
  }, [])
  // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  // Autoriza erecebimento mensagensasync function requestUserPermission() {
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }


  // useEffect(() => {

    // if (requestUserPermission()) {
    //   // Return fcm token for the
    //   messaging().getToken().then(token => {
    //     console.log(token);
    //   })
    // } else {
    //   console.log("Failed token status", authStatus);
    // }
    
    // Check whether an initial notification is available
    // messaging()
    //   .getInitialNotification()
    //   .then(async (remoteMessage) => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage.notification,
    //       );
    //     }
    //   });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

  //   messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //   });

  //   // Register background handler
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log('Message handled in the background!', remoteMessage);
  //   });

  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
    
  // }, [])

  // Redireciona para home
  useEffect(() => {

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });

    if (connected === false) {
      disconnect();
    } else {
      return;
    };

  }, [connected]);

  // useEffect(() => {
  //   const getRegisterDevice = (async () => {
  //     await serviceapp.get('()')
  //       .then((response) => {
  //         console.log();
  //       }).catch((err) => {
  //         console.log(err);
  //       })
  //   });
  //   getRegisterDevice();
  // }, []);

  return (
    <></>
  )
}
export default Disconnect;