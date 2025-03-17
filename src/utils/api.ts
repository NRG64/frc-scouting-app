import axios from "axios";
import type { MatchData, MatchMetadata } from "@/app/types";

const API_URL = "";

interface SubmitMatchDataParams {
  metadata: MatchMetadata;
  matchData: MatchData[];
}

export async function submitMatchToServer({
  metadata,
  matchData,
}: SubmitMatchDataParams) {
  try {
    const response = await axios.post(`${API_URL}/matches`, {
      metadata,
      matchData,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting match data:", error);
    throw error;
  }
}
