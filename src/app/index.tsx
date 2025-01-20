import { Link } from "expo-router";
import React from "react";
import { Text, View , TouchableWithoutFeedback, StyleSheet, SafeAreaView, Image} from "react-native";

interface TouchAreaProps {
  imageSource: '../assets/gameField'
  onTouch: (x:number, y:number) => void 
};


const index = () => {
  return (
   <SafeAreaView style={styles.container}>
     <Image source={require('../assets/gameField.png')}
     style={{width: 1210, height: 660}} />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex : 1,
    allignItems: 'center'

  },

});


export default index
