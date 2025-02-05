
import { Stack } from "expo-router";
import { Link } from "expo-router";
import React, {useEffect, useState} from "react";
import { Text, View , TouchableWithoutFeedback, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button, Modal, Pressable, FlatList} from "react-native";

interface TouchAreaProps {
  imageSource: '../assets/gameField'
  onTouch: (x:number, y:number) => void 
};
// Define button positions individually
const buttonConfigs = [
  { name: "A", top: 230, left: 180 },
  { name: "B", top: 260, left: 180 },
  { name: "C", top: 295, left: 195 },
  { name: "D", top: 310, left: 220 },
  { name: "E", top: 310, left: 275 },
  { name: "F", top: 300, left: 295 },
  { name: "G", top: 315, left: 260 },
  { name: "H", top: 315, left: 230 },
  { name: "I", top: 250, left: 390 },
  { name: "J", top: 230, left: 355 },
  { name: "K", top: 230, left: 285 },
  { name: "L", top: 250, left: 250 },
  
];

const index = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null); // track active button 
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [timer, setTimer] = useState(0); // ime in seconds
  const [isRunning, setIsRunning] = useState(false); // track state of timer 
  const [resumeAllowed, setresumeAllowed] = useState(true); // resume
  const [presses, setPresses] = useState<{ id: string; timestamp: string; x?: number; y?: number }[]>([]); // store presses

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

  const handleImagePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });
    handleButtonPress("image", locationX, locationY);
  };

  const handleButtonPress = (buttonName: string, x?: number, y?: number, source: string = "Field") => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    const timestamp = `${minutes}:${seconds}`;

    setPresses((prev) => [
      ...prev,
      { id: buttonName, timestamp, x, y },
    ]);
    const validButtons = buttonConfigs.map((button) => button.name); // ['A', 'B', ..., 'L']
  if (source === "Field" && validButtons.includes(buttonName)) {
    setActiveButton(buttonName);
    setModalVisible(true);
  }
  };

    

  const handleModalButtonPress = (buttonText: string): void => {

    const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timer % 60).toString().padStart(2, "0");
  const timestamp = `${minutes}:${seconds}`;


    setModalVisible(false); // Close the modal
    setPresses((prev) => [
      ...prev,
      { id: buttonText, timestamp, source: "Modal" }, // Record the timestamp
    ]);
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
        style={{ width: 900, height: 490.5 }}
      />
      </Pressable>

      {buttonConfigs.map((button, index) => (
        <View
          key={index}
          style={[styles.buttonContainer, { top: button.top, left: button.left }]}
        >
          <Button
            onPress={() => handleButtonPress(button.name)}
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
            {["L1", "L2", "L3", "L4"].map((modalButtonName) => (
              <TouchableOpacity
                key={modalButtonName}
                style={styles.modalButton}
                onPress={() => handleModalButtonPress(modalButtonName)}
              >
                <Text style={styles.modalButtonText}>{modalButtonName}</Text>
              </TouchableOpacity>
          ))}
            </View>
          </View>
        </View>
        </Modal>

        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Button Press History</Text>
          <FlatList
            data={presses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.id}</Text>
                <Text style={styles.tableCell}>{item.timestamp}</Text>
                {item.x !== undefined && item.y !== undefined && (
                  <>
                    <Text style={styles.tableCell}>X: {item.x.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>Y: {item.y.toFixed(1)}</Text>
                  </>
                )}
              </View>
            )}
          />
        </View>

        
        
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
    },
    tableContainer: {
      width: 250, 
      marginTop: 20,
      padding: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      maxHeight: 300, 
    },
    tableHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    tableCell: {
      fontSize: 16,
    },
});
export default index
