"use client";

import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buttonConfigs } from "./constants";
import { MatchTable } from "@/components/match-table";
import { submitMatchToServer } from "@/utils/api";
import type { MatchData, MatchMetadata, StoredMatch } from "./types";

export default function index() {
  const [ButtonModalVisible, setButtonModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [viewDataModalVisible, setViewDataModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [resumeAllowed, setresumeAllowed] = useState(true);
  const [presses, setPresses] = useState<MatchData[]>([]);
  const [shotModalVisible, setShotModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [storedData, setStoredData] = useState<StoredMatch[]>([]);
  const [algaeModalVisible, setAlgaeModalVisible] = useState(false);
  const [selectedAlgae, setSelectedAlgae] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [metadata, setMetadata] = useState<MatchMetadata>({
    teamNumber: "",
    matchNumber: "",
    teamName: "",
  });

  async function saveAndSubmitMatch() {
    try {
      const matchData: StoredMatch = {
        metadata,
        matchData: presses,
        timestamp: new Date().toISOString(),
      };

      const existingData = await AsyncStorage.getItem("scoutingData");
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const newData = [...parsedData, matchData];
      await AsyncStorage.setItem("scoutingData", JSON.stringify(newData));

      try {
        await submitMatchToServer(matchData);
        Alert.alert("Success", "Match data saved and submitted successfully!");
      } catch (error) {
        Alert.alert(
          "Warning",
          "Data saved locally but failed to submit to server. It will be synced later."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save match data");
      console.error("Error saving data:", error);
    }
  }

  async function loadMatches() {
    try {
      const data = await AsyncStorage.getItem("scoutingData");
      if (data) {
        const parsedData: StoredMatch[] = JSON.parse(data);
        setStoredData(parsedData);
        setViewDataModalVisible(true);
      } else {
        Alert.alert("Info", "No stored matches found");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load stored matches");
      console.error("Error loading data:", error);
    }
  }

  function updateMetadata(key: string, value: string) {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

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

          return prev + 10;
        });
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, resumeAllowed]);

  function startOrResumeTimer() {
    if (!isRunning) {
      if (timer === 0) {
        setIsRunning(true);
        setresumeAllowed(true);
      } else if (resumeAllowed) {
        setIsRunning(true);
        setresumeAllowed(false);
      } else {
        alert("Cannot resume");
      }
    }
  }

  async function saveMatch() {
    await saveAndSubmitMatch();
    setTimer(0);
    setIsRunning(false);
    setresumeAllowed(true);
    setPresses([]);
  }

  function formatTimer(time: number) {
    const minutes = Math.floor(time / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    const milliseconds = ((time % 1000) / 10).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  function handleFieldPress(event: any) {
    const { locationX, locationY } = event.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });

    const isNearButton = buttonConfigs.some(
      (button) =>
        Math.abs(locationX - button.left) < 30 &&
        Math.abs(locationY - button.top) < 30
    );

    if (!isNearButton && isRunning) {
      setFieldModalVisible(true);
    }
  }

  function processFieldAction(action: string) {
    const timestamp = formatTimer(timer);

    if (action === "Net") {
      setSelectedAction("Net");
      setFieldModalVisible(false);
      setShotModalVisible(true);
    } else {
      setPresses((prev) => [
        ...prev,
        { id: action, timestamp, x: coordinates?.x, y: coordinates?.y },
      ]);
      setFieldModalVisible(false);
    }
  }

  function recordShotResult(result: string) {
    const timestamp = formatTimer(timer);
    setPresses((prev) => [
      ...prev,
      {
        id: `${selectedAction} - ${result}`,
        timestamp,
        x: coordinates?.x,
        y: coordinates?.y,
      },
    ]);
    setShotModalVisible(false);
  }

  function recordButtonAction(
    buttonName: string,
    x?: number,
    y?: number,
    source = "Field"
  ) {
    const timestamp = formatTimer(timer);
    setPresses((prev) => [...prev, { id: buttonName, timestamp, x, y }]);

    const noModalButtons = [
      "HP 1",
      "HP 2",
      "processor",
      "Robot enabled",
      "Robot disabled",
      "R",
      "Defense played",
    ];
    const validButtons = buttonConfigs.map((button) => button.name);

    if (
      source === "Field" &&
      validButtons.includes(buttonName) &&
      !noModalButtons.includes(buttonName)
    ) {
      setActiveButton(buttonName);
      setButtonModalVisible(true);
    }
  }

  function updateButtonAction(buttonText: string): void {
    setButtonModalVisible(false);

    setPresses((prev) => {
      if (prev.length === 0) return prev;

      const lastPress = prev[prev.length - 1];
      if (!lastPress.id.includes(" - ")) {
        const updatedPress = {
          ...lastPress,
          id: `${lastPress.id} - ${buttonText}`,
        };
        return [...prev.slice(0, -1), updatedPress];
      }

      return prev;
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {Math.floor(timer / 60000)
              .toString()
              .padStart(2, "0")}
            :
            {Math.floor((timer % 60000) / 1000)
              .toString()
              .padStart(2, "0")}
            :{((timer % 1000) / 10).toFixed(0).padStart(2, "0")}
          </Text>
        </View>

        <View style={styles.controls}>
          <Button
            title={
              !isRunning
                ? timer === 0
                  ? "Start Timer"
                  : "Resume Timer"
                : "Running..."
            }
            onPress={startOrResumeTimer}
            disabled={isRunning}
          />
          <Button title="Reset Timer" onPress={saveMatch} />
        </View>

        <View style={styles.metadataContainer}>
          <Text style={styles.metadataHeader}>Match Information</Text>
          <View style={styles.metadataRow}>
            <Text>Team Number:</Text>
            <TextInput
              style={styles.input}
              value={metadata.teamNumber}
              onChangeText={(value) => updateMetadata("teamNumber", value)}
              placeholder="Enter Team Number"
            />
          </View>
          <View style={styles.metadataRow}>
            <Text>Match Number:</Text>
            <TextInput
              style={styles.input}
              value={metadata.matchNumber}
              onChangeText={(value) => updateMetadata("matchNumber", value)}
              placeholder="Enter Match Number"
            />
          </View>
          <View style={styles.metadataRow}>
            <Text>Team Name:</Text>
            <TextInput
              style={styles.input}
              value={metadata.teamName}
              onChangeText={(value) => updateMetadata("teamName", value)}
              placeholder="Enter Team Name"
            />
          </View>
        </View>

        <Pressable onPressIn={handleFieldPress}>
          <Image
            source={require("../assets/gameField.png")}
            style={{ width: 900, height: 490.5 }}
          />

          {buttonConfigs
            .filter((button) => !button.type)
            .map((button, index) => (
              <View
                key={`button-${index}`}
                style={[
                  styles.buttonContainer,
                  { top: button.top, left: button.left },
                ]}
              >
                <Button
                  onPress={() => recordButtonAction(button.name)}
                  title={button.name}
                  color="#D30000"
                />
              </View>
            ))}

          {buttonConfigs
            .filter((button) => button.type === "algae")
            .map((button, index) => (
              <TouchableOpacity
                key={`algae-${index}`}
                style={[
                  styles.aquaCircle,
                  { top: button.top, left: button.left },
                ]}
                onPress={() => {
                  setSelectedAlgae({ x: button.left, y: button.top });
                  setAlgaeModalVisible(true);
                }}
              />
            ))}
        </Pressable>

        <Modal transparent={true} visible={ButtonModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Button Pressed: {activeButton}
              </Text>
              <View style={styles.modalButtonGroup}>
                {["L1", "L2", "L3", "L4", "Miss"].map((modalButtonName) => (
                  <TouchableOpacity
                    key={modalButtonName}
                    style={styles.modalButton}
                    onPress={() => updateButtonAction(modalButtonName)}
                  >
                    <Text style={styles.modalButtonText}>
                      {modalButtonName}
                    </Text>
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
                    onPress={() => processFieldAction(action)}
                  >
                    <Text style={styles.modalButtonText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent={true} visible={shotModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Shot Result</Text>
              <View style={styles.modalButtonGroup}>
                {["Hit", "Miss"].map((result) => (
                  <TouchableOpacity
                    key={result}
                    style={styles.modalButton}
                    onPress={() => recordShotResult(result)}
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
              <View style={styles.modalButtonGroup}>
                {["Remove Algae", "Intake Algae"].map((action) => (
                  <TouchableOpacity
                    key={action}
                    style={styles.modalButton}
                    onPress={() => {
                      setPresses((prev) => [
                        ...prev,
                        {
                          id: action,
                          timestamp: formatTimer(timer),
                          x: selectedAlgae?.x,
                          y: selectedAlgae?.y,
                        },
                      ]);
                      setAlgaeModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button
                title="Close"
                onPress={() => setAlgaeModalVisible(false)}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Match Events</Text>
          <MatchTable data={presses} />
        </View>

        <Button title="View Stored Matches" onPress={loadMatches} />

        <Modal visible={viewDataModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Stored Matches</Text>
              <ScrollView style={styles.storedMatchesScroll}>
                {storedData.map((match, index) => (
                  <View key={index} style={styles.storedMatch}>
                    <View style={styles.matchHeader}>
                      <Text style={styles.matchTitle}>
                        Match {match.metadata.matchNumber} -{" "}
                        {match.metadata.teamName}
                      </Text>
                      <Text style={styles.matchTime}>
                        {new Date(match.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <MatchTable data={match.matchData} />
                  </View>
                ))}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => setViewDataModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    position: "absolute",
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
    alignItems: "center",
    backgroundColor: "black",
    padding: 10,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tableContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  metadataContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  metadataHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 10,
    padding: 5,
  },
  storedMatchesScroll: {
    maxHeight: "80%",
  },
  storedMatch: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  matchHeader: {
    padding: 12,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  matchTime: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  aquaCircle: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#06b6d4",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0891b2",
  },
});
