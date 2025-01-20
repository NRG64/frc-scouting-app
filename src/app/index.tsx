import { Link } from "expo-router";
import React from "react";
import { Text, View , TouchableWithoutFeedback, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button} from "react-native";

interface TouchAreaProps {
  imageSource: '../assets/gameField'
  onTouch: (x:number, y:number) => void 
};


const index = () => {
  const onPress = (): void => {
// (score action)
  };
  return (
   <SafeAreaView style={styles.container}>
     <Image source={require('../assets/gameField.png')}
     style={{width: 1210, height: 660}} />

    <View>
    <Button onPress = {onPress} title= "A" color = "#D30000"/>
    </View>
  
  </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex : 1,
    alignItems: 'center'
  },
  buttoncontainer: {
    flex:1
  },

});


export default index
