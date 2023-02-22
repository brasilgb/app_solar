import React, { Fragment } from "react";
import { View, Text, StatusBar, Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

interface StatusBarProps {
    style?: any;
    background?: string;
}
const AppStatusBar = ({ style, background}: StatusBarProps) => {
  return (
    <Fragment>
      <ExpoStatusBar translucent style={style} backgroundColor={background}/>
      {Platform.OS === 'ios' && 
      <View style={{backgroundColor: background}} className={`w-full h-[100px] absolute top-0 left-0`}/>
      }
    </Fragment>
  )
}

export default AppStatusBar;