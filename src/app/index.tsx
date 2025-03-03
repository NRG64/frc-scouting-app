import React, {useEffect, useState} from "react";
import { Text, View , TouchableOpacity, StyleSheet, SafeAreaView, Image, Button, Modal, Pressable, FlatList, TextInput, ScrollView} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TouchAreaProps {
  imageSource: '../assets/gameField'
  onTouch: (x:number, y:number) => void 
};
const baseX = 168
const baseY = 215


const buttonConfigs = [
  { name: "A", top: baseY, left: baseX },
  { name: "B", top: baseY + 30, left: baseX },
  { name: "C", top: baseY + 65, left: baseX + 13 },
  { name: "D", top: baseY + 85, left: baseX + 40 },
  { name: "E", top: baseY + 85, left: baseX + 93 },
  { name: "F", top: baseY + 65, left: baseX + 120 },
  { name: "G", top: baseY + 30, left: baseX + 133 },
  { name: "H", top: baseY, left: baseX + 133 },
  { name: "I", top: baseY - 35, left: baseX + 120 },
  { name: "J", top: baseY - 55, left: baseX + 93 },
  { name: "K", top: baseY - 55, left: baseX + 40 },
  { name: "L", top: baseY - 35, left: baseX + 13 },

  {name: "HP 1", top: baseY - 170, left: 20},
  {name: "HP 2", top: baseY + 200, left: 20},
  {name: "processor", top: 455 , left: 303 },
  {name: "Robot disabled", top: 200, left: 1050},
  {name: "Robot enabled", top: 200, left: 900},
  {name: "Defense played", top: 240, left: 900},

  { name: "", top: baseY + 20, left: baseX + 38, type: "algae" },
  { name: "", top: baseY + 20, left: baseX + 100, type: "algae" },
  { name: "", top: baseY + 48, left: baseX + 52, type: "algae" },
  { name: "", top: baseY - 7, left: baseX + 52, type: "algae" },
  { name: "", top: baseY - 7, left: baseX + 85, type: "algae" },
  { name: "", top: baseY + 48, left: baseX + 85, type: "algae" },
];



const index = () => {

  const [ButtonModalVisible, setButtonModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [viewDataModalVisible, setViewDataModalVisible] = useState(false); // Modal for viewing stored data
  const [activeButton, setActiveButton] = useState<string | null>(null); // track active button 
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [timer, setTimer] = useState(0); // ime in seconds
  const [isRunning, setIsRunning] = useState(false); // track state of timer 
  const [resumeAllowed, setresumeAllowed] = useState(true); // resume
  const [presses, setPresses] = useState<{ id: string; timestamp: string; x?: number; y?: number }[]>([]); // store presses
  const [shotModalVisible, setShotModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [storedData, setStoredData] = useState([]); // To hold the stored data from AsyncStorage
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // To track the index of the row being edited
  const [editedRow, setEditedRow] = useState(""); // To hold the currently edited row data
  const [algaeModalVisible, setAlgaeModalVisible] = useState(false);
  const [selectedAlgae, setSelectedAlgae] = useState<{ x: number; y: number } | null>(null);



  const Store = async () => {
    try {
      const existingData = await AsyncStorage.getItem('scoutingData');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const newData = [...parsedData, { match: metadata.matchNumber, data: presses }];
  
      await AsyncStorage.setItem('scoutingData', JSON.stringify(newData));
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const loadTableFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('scoutingData');
      if (data) {
        const parsedData = JSON.parse(data);
        console.log("Loaded Data:", JSON.stringify(parsedData, null, 2));
        setStoredData(parsedData);
        alert('Data loaded successfully!');
        setViewDataModalVisible(true); 
        console.log(parsedData); // You can display this in a UI for editing
      } else {
        alert('No data found!');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveEditedData = async () => {
    try {
      if (editingIndex !== null) {
        const updatedData = [...storedData];
        updatedData[editingIndex] = JSON.parse(editedRow); // Update the row with new data
        setStoredData(updatedData);
        await AsyncStorage.setItem('scoutingData', JSON.stringify(updatedData));
        alert('Data updated successfully!');
        setEditingIndex(null);
        setEditedRow(""); // Clear editing state
      }
    } catch (error) {
      console.error('Error saving edited data:', error);
    }
  };

  const deleteRow = async (index: number) => {
    try {
      const updatedData = storedData.filter((_, i) => i !== index);
      setStoredData(updatedData);
      await AsyncStorage.setItem('scoutingData', JSON.stringify(updatedData));
      alert('Row deleted successfully!');
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  

  const [metadata, setMetadata] = useState({
    teamNumber: "",
    matchNumber: "",
    teamName: "",
  });const handleMetadataChange = (key: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
  
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 150000) { 
            if (interval) clearInterval(interval);
            alert("Match Ended");
            setIsRunning(false);
            return 150000; 
          }

          if (prev >= 15000 && resumeAllowed) {
            if (interval) clearInterval(interval);
            interval = null;
            alert("Timer Paused");
            setIsRunning(false);
            setresumeAllowed(true);
            return prev;
          }
  
          return prev + 10; // Increase by 10ms instead of 1 second
        });
      }, 10); // Update every 10ms instead of every second
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
  
  const resetTimer = async () => {
    await Store();
    setTimer(0); // Reset the timer to 0
    setIsRunning(false); // Stop the timer
    setresumeAllowed(true); // Allow resume
    setPresses([]);
  };

  const handleImagePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });

    const isNearButton = buttonConfigs.some(
      (button) =>
        Math.abs(locationX - button.left) < 30 && Math.abs(locationY - button.top) < 30
    );
  
    if (!isNearButton && isRunning) {
      setCoordinates({ x: locationX, y: locationY });
      setFieldModalVisible(true);
    }
  };
  const formatTimestamp = (time: number) => {
    const minutes = Math.floor(time / 60000).toString().padStart(2, "0");
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, "0");
    const milliseconds = ((time % 1000) / 10).toFixed(0).padStart(2, "0");
  
    return `${minutes}:${seconds}:${milliseconds}`;
  };
  
  

  const handleFieldPress = (action: string) => {
    const timestamp = formatTimestamp(timer); 
  
    if (action === "Net") {
      // Handle special case for Shot
      setSelectedAction("Net");
      setFieldModalVisible(false); // Close field modal
      setShotModalVisible(true);   // Open shot modal
    } else {

      setPresses((prev) => [
        ...prev,
        { id: action, timestamp, x: coordinates?.x, y: coordinates?.y },
      ]);
      setFieldModalVisible(false); // Close the modal
    }
  };

  const handleShotSelection = (result: string) => {
    const timestamp = formatTimestamp(timer); 

  setPresses((prev) => [
    ...prev,
    {
      id: `${selectedAction} - ${result}`, 
      timestamp,
      x: coordinates?.x,
      y: coordinates?.y,
    },
  ]);
    setShotModalVisible(false); // Close the shot modal
  };
  
  const handleButtonPress = (buttonName: string, x?: number, y?: number, source: string = "Field") => {
    const timestamp = formatTimestamp(timer); 

  setPresses((prev) => [
    ...prev,
    { id: buttonName, timestamp, x, y },
  ]);

    const noModalButtons = ["HP 1", "HP 2", "processor", "Robot enabled", "Robot disabled", "R", "Defense played"];
  

    const validButtons = buttonConfigs.map((button) => button.name); // ['A', 'B', ..., 'L']

    if (source === "Field" && validButtons.includes(buttonName) && !noModalButtons.includes(buttonName)) {
      setActiveButton(buttonName);
      setButtonModalVisible(true);
    }
  };

  
  

    

  const handleModalButtonPress = (buttonText: string): void => {
    setButtonModalVisible(false); // Close the modal
  
    setPresses((prev) => {
      if (prev.length === 0) return prev; // Prevents errors if no prior entry exists
  
      const lastPress = prev[prev.length - 1]; // Get the most recent press
      if (!lastPress.id.includes(" - ")) {
        // Append L1, L2, etc. only if it hasn't been added already
        const updatedPress = { ...lastPress, id: `${lastPress.id} - ${buttonText}` };
        return [...prev.slice(0, -1), updatedPress]; // Replace the last press with the updated version
      }
  
      return prev; // If already updated, do nothing
    });
  };
  

  return (

    <SafeAreaView style={styles.container}>
      
      <ScrollView>
        <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {Math.floor(timer / 60000).toString().padStart(2, "0")}:
          {Math.floor((timer % 60000) / 1000).toString().padStart(2, "0")}:
          {((timer % 1000) / 10).toFixed(0).padStart(2, "0")}
        </Text>
      </View>


        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <Button title="View Stored Data" onPress={loadTableFromStorage} />
        </View>

        <Modal visible={viewDataModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Stored Data</Text>
              {storedData.length > 0 ? (
                <FlatList
                  data={storedData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataTitle}>Match {item.matchNumber}</Text>
                      <Text>Team Name: {item.teamName}</Text>
                      <Text>Team Number: {item.teamNumber}</Text>
                      <Text>Time Saved: {new Date(item.timestamp).toLocaleString()}</Text>
                      
                    
                      <FlatList
                        data={item.data}
                        keyExtractor={(press, idx) => idx.toString()}
                        renderItem={({ item: press }) => (
                          <Text>- {press.id} at {press.timestamp} (X: {press.x}, Y: {press.y})</Text>
                        )}
                      />
                    </View>
                  )}
                />
              ) : (
                <Text>No Data Available</Text>
              )}

              <Button title="Close" onPress={() => setViewDataModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <View style={styles.controls}>
          <Button
            title={!isRunning ? (timer === 0 ? "Start Timer" : "resume Timer") : "Running..."}
            onPress={handleStartOrresume}
            disabled={isRunning} // Disable while the timer is running
          />
          <Button title="Reset Timer" onPress={resetTimer} />
        </View>

        <View style={styles.metadataContainer}>
        <Text style={styles.metadataHeader}>Match Information</Text>
        <View style={styles.metadataRow}>
          <Text>Team Number:</Text>
          <TextInput
            style={styles.input}
            value={metadata.teamNumber}
            onChangeText={(value) => handleMetadataChange("teamNumber", value)}
            placeholder="Enter Team Number"
          />
        </View>
        <View style={styles.metadataRow}>
          <Text>Match Number:</Text>
          <TextInput
            style={styles.input}
            value={metadata.matchNumber}
            onChangeText={(value) => handleMetadataChange("matchNumber", value)}
            placeholder="Enter Match Number"
          />
        </View>
        <View style={styles.metadataRow}>
          <Text>Team Name:</Text>
          <TextInput
            style={styles.input}
            value={metadata.teamName}
            onChangeText={(value) => handleMetadataChange("teamName", value)}
            placeholder="Enter Team Name"
          />
        </View>
      </View>


      <Pressable onPressIn={handleImagePress}>
  <Image
    source={require("../assets/gameField.png")}
    style={{ width: 900, height: 490.5 }}
  />

  {/* Render Standard Red Buttons */}
  {buttonConfigs
    .filter((button) => !button.type) // Ignore algae buttons
    .map((button, index) => (
      <View key={`button-${index}`} style={[styles.buttonContainer, { top: button.top, left: button.left }]}>
        <Button onPress={() => handleButtonPress(button.name)} title={button.name} color="#D30000" />
      </View>
    ))}

  {/* Render Aqua Algae Buttons */}
  {buttonConfigs
    .filter((button) => button.type === "algae") // Only algae buttons
    .map((button, index) => (
      <TouchableOpacity
        key={`algae-${index}`}
        style={[styles.aquaCircle, { top: button.top, left: button.left }]}
        onPress={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          setSelectedAlgae({ x: locationX, y: locationY });
          setAlgaeModalVisible(true);
        }}
      />
    ))}
</Pressable>


     
        <Modal
        transparent={true}
        visible={ButtonModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Button Pressed: {activeButton}</Text>
            <View style={styles.modalButtonGroup}>
            {["L1", "L2", "L3", "L4", "Miss"].map((modalButtonName) => (
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

              <Modal transparent={true} visible={fieldModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Field Action</Text>
            <View style={styles.modalButtonGroup}>
              {["Intake Algae", "Intake Coral", "Net"].map((action) => (
                <TouchableOpacity
                  key={action}
                  style={styles.modalButton}
                  onPress={() => handleFieldPress
                (action)}
                >
                  <Text style={styles.modalButtonText}>{action}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

            <Modal transparent={true} visible={shotModalVisible}> //shotmodal
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Shot Result</Text>
            <View style={styles.modalButtonGroup}>
              {["Hit", "Miss"].map((result) => (
                <TouchableOpacity
                  key={result}
                  style={styles.modalButton}
                  onPress={() => handleShotSelection(result)}
                >
                  <Text style={styles.modalButtonText}>{result}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={algaeModalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Algae Action</Text>
      <Text>Coordinates: X: {selectedAlgae?.x?.toFixed(1)}, Y: {selectedAlgae?.y?.toFixed(1)}</Text>

      <View style={styles.modalButtonGroup}>
        {["Remove Algae", "Intake Algae"].map((action) => (
          <TouchableOpacity
            key={action}
            style={styles.modalButton}
            onPress={() => {
              setPresses((prev) => [
                ...prev,
                { id: action, timestamp: formatTimestamp(timer), x: selectedAlgae?.x, y: selectedAlgae?.y },
              ]);
              setAlgaeModalVisible(false); // Close modal after selection
            }}
          >
            <Text style={styles.modalButtonText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Close" onPress={() => setAlgaeModalVisible(false)} />
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

        
        </ScrollView>
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
      width: 500, 
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
    metadataContainer: { padding: 10, backgroundColor: "#f0f0f0" },
    metadataHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    metadataRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 10,
    padding: 5,
    width: 200,
    },
    dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    dataText: {
      flex: 1,
      fontSize: 16,
    },
    editButton: {
      backgroundColor: '#2196F3',
      padding: 5,
      borderRadius: 5,
    },
    editButtonText: {
      color: 'white',
    },
    deleteButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: 'white',
    },
    dataTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    hexButton: {
      width: 45,
      height: 45,
      backgroundColor: "white", 
      borderWidth: 3, 
      borderColor: "#D300F7", 
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5, 
    },
    defaultButton: {
      width: 45, 
      height: 45,
      backgroundColor: "#D30000", 
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    aquaCircle: {
      position: "absolute",
      width: 20,
      height: 20,
      backgroundColor: "blue",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#007FFF",
    },
    
  });
  

export default index
