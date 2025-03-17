export interface MatchData {
  id: string;
  timestamp: string;
  x?: number;
  y?: number;
}

export interface MatchMetadata {
  teamNumber: string;
  matchNumber: string;
  teamName: string;
}

export interface StoredMatch {
  metadata: MatchMetadata;
  matchData: MatchData[];
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  matchId?: string;
}
