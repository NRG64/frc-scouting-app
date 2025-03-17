import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StoredMatch, MatchData, MatchMetadata } from "@/app/types";

const STORAGE_KEY = "scoutingData";

export async function saveMatchData(
  metadata: MatchMetadata,
  data: MatchData[]
) {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedData: StoredMatch[] = existingData
      ? JSON.parse(existingData)
      : [];

    const newMatch: StoredMatch = {
      metadata,
      matchData: data,
      timestamp: new Date().toISOString(),
    };

    const newData = [...parsedData, newMatch];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error("Error saving match:", error);
    return false;
  }
}

export const loadAllMatches = async (): Promise<StoredMatch[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading matches:", error);
    return [];
  }
};

export const deleteMatchByTimestamp = async (
  timestamp: string
): Promise<boolean> => {
  try {
    const matches = await loadAllMatches();
    const updatedMatches = matches.filter(
      (match) => match.timestamp !== timestamp
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
    return true;
  } catch (error) {
    console.error("Error deleting match:", error);
    return false;
  }
};
