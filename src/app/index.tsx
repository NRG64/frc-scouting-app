import { Link } from "expo-router";
import React from "react";
import { Text, View , TouchableWithoutFeedback, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button} from "react-native";

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
  const onPress = (buttonName: string): void => {
    console.log(`Button ${buttonName} pressed!`);
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
});
export default index
