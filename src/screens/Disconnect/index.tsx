import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackPrams";
import { AuthContext } from "../../contexts/auth";

const Disconnect = () => {
  const { user, disconnect } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  let connected = user?.connected;

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

  return (
    <>
    
    </>
  )
}
export default Disconnect;