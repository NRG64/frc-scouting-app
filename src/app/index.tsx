
import { Stack } from "expo-router";
import { Link } from "expo-router";
import React, {useState} from "react";
import { Text, View , TouchableWithoutFeedback, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button, Modal} from "react-native";

interface TouchAreaProps {
  imageSource: '../assets/gameField'
  onTouch: (x:number, y:number) => void 
};


// Define button positions individually
const buttonConfigs = [
  { name: "A", top: 300, left: 230 },
  { name: "B", top: 335, left: 230 },
  { name: "C", top: 385, left: 250 },
  { name: "D", top: 400, left: 285 },
  { name: "E", top: 400, left: 355 },
  { name: "F", top: 385, left: 390 },
  { name: "G", top: 335, left: 410 },
  { name: "H", top: 300, left: 410 },
  { name: "I", top: 250, left: 390 },
  { name: "J", top: 230, left: 355 },
  { name: "K", top: 230, left: 285 },
  { name: "L", top: 250, left: 250 },
  
];

const index = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null); // track active button 

  const onPress = (buttonName: string): void => {
    setActiveButton(buttonName);
    setModalVisible(true); 
  };

  return (

    <SafeAreaView style={styles.container}>

      <Image
        source={require("../assets/gameField.png")}
        style={{ width: 1210, height: 660 }}
      />

      {buttonConfigs.map((button, index) => (
        <View
          key={index}
          style={[styles.buttonContainer, { top: button.top, left: button.left }]}
        >
          <Button
            onPress={() => onPress(button.name)}
            title={button.name}
            color="#D30000"
          />
        </View>
      ))}
        <Modal
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Button Pressed: {activeButton}</Text>
            <Button title="Close Modal" onPress={() => setModalVisible(false)} />
          </View>
        </View>
        </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Enables absolute positioning for buttons
  },
  buttonContainer: {
    position: "absolute", // Allows precise placement of buttons
  },
  link: {
    paddingTop: 20,
    fontSize: 20 ,
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
export default index
