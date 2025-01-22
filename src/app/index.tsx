
import { Stack } from "expo-router";
import { Link } from "expo-router";
import React, {useEffect, useState} from "react";
import { Text, View , TouchableWithoutFeedback, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button, Modal, Pressable} from "react-native";

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

const HPbutton = [
  {name: "HP1", top: 100, left: 50},
  {name: "HP2", top: 500, left: 50 }
];

const index = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null); // track active button 
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [timer, setTimer] = useState(0); // ime in seconds
  const [isRunning, setIsRunning] = useState(false); // track state of timer 
  const [resumeAllowed, setresumeAllowed] = useState(true); // resume

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
  
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          // Automatically stop at 150
          if (prev >= 150) {
            if (interval) clearInterval(interval);
            alert("Match Ended");
            setIsRunning(false);
            return 150; // Cap timer at 150
          }
  
          // Pause at 15 seconds
          if (prev === 15 && resumeAllowed) {
            if (interval) clearInterval(interval);
            interval = null;
            alert("Timer Paused");
            setIsRunning(false);
            setresumeAllowed(true); // Allow resume
            return prev;// Stop at 15 seconds
          }
  
          return prev + 1
        });
      }, 1000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, resumeAllowed]);
  
  // Start timer
  const startTimer = () => {
    if (timer < 150) {
      setIsRunning(true);
      setresumeAllowed(false); // Prevent multiple resumes
    } else {
      alert("Match Over");
    }
  };

  const handleStartOrresume = () => {
    if (!isRunning) {
      if (timer === 0) { // Start the timer from 0
        setIsRunning(true);
        setresumeAllowed(true); // Ensure it pauses at 15 seconds
      } else if (resumeAllowed) { // resume the timer from its paused state
        setIsRunning(true);
        setresumeAllowed(false); // Prevent another pause at 15 seconds
      } else {
        alert("Cannot resume");
      }
    }
  };
  
  const resetTimer = () => {
    setTimer(0); // Reset the timer to 0
    setIsRunning(false); // Stop the timer
    setresumeAllowed(true); // Allow resume
  };


  const onPress = (buttonName: string): void => {
    setActiveButton(buttonName);
    setModalVisible(true); 
  };

  const handleImagePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });
    console.log(`Clicked at X: ${locationX}, Y: ${locationY}`);
  };

  const handleModalButtonPress = (buttonText: string): void => {
    setModalVisible(false); // Close the modal
  };

  return (

    <SafeAreaView style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
          {Math.floor(timer / 60)
           .toString()
           .padStart(2, "0")}:
          {(timer % 60).toString().padStart(2, "0")}
          </Text>
        </View>

        <View style={styles.controls}>
          <Button
            title={!isRunning ? (timer === 0 ? "Start Timer" : "resume Timer") : "Running..."}
            onPress={handleStartOrresume}
            disabled={isRunning} // Disable while the timer is running
          />
          <Button title="Reset Timer" onPress={resetTimer} />
        </View>


      <Pressable onPressIn = {handleImagePress}>
      <Image
        source={require("../assets/gameField.png")}
        style={{ width: 1210, height: 660 }}
      />
      </Pressable>

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
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalButtonPress("L1")}
              >
                <Text style={styles.modalButtonText}>Option 1</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalButtonPress("L2")}
              >
                <Text style={styles.modalButtonText}>Option 2</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalButtonPress("L3")}
              >
                <Text style={styles.modalButtonText}>Option 3</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleModalButtonPress("L4")}
              >
                <Text style={styles.modalButtonText}>Option 4</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Modal>
        
        {HPbutton.map((button, index) => (
        <View
          key={`set1-${index}`}
          style={[
            styles.buttonContainer,
            { top: button.top, left: button.left },
          ]}
        >
          <Button
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
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
    modalButtonGroup: {
      marginTop: 20,
      width: "100%",
  },
    timerContainer: {
      position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    },
    timerText: {
      fontSize: 24,
    color: "white",
    fontWeight: "bold",
    },
    controls:{
      position: "absolute",
    bottom: 70,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    }
});
export default index
