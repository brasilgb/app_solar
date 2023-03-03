import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { shadowAll } from "../../Styles";
interface AppModalProps {
    children: React.ReactNode;
    modalVisible: any;
    onTouchEnd: any;
}

const AppModal = ({ children, modalVisible, onTouchEnd }: AppModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={modalVisible}
            onRequestClose={onTouchEnd}
        >
            <View className="flex-1 items-center justify-center bg-[#000000a7]">
                <View
                    style={shadowAll}
                    className="m-5 py-[5px] bg-gray-200 rounded-md border-2 border-white z-10"
                >
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default AppModal;