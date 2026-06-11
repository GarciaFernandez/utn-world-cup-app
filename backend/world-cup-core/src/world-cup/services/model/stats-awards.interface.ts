// Estructura base común para las respuestas del servidor
export interface BaseServerResponse<T> {
  serverTime: string;
  data: T;
  responseMessage: {
    messageCode: string;
    message: string;
  };
  success: boolean;
}

// === INTERFACE DE /world-cup/current/awards ===
export interface AwardItem {
  code: string;
  winnerName: string;
  teamId: string;
  teamName: string;
  reason: string;
  goals: number;
  playerOfMatch: number;
  fairPlayPoints?: number;
  yellowCards?: number;
  redCards?: number;
}

// === INTERFACE DE /world-cup/current/player-stats ===
export interface PlayerStatsItem {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  position: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  playerOfMatch: number;
}

// === INTERFACES DE /world-cup/current/stats ===
export interface BaseTeamPlacement {
  teamId: string;
  teamName: string;
}

export interface LeaderboardItem {
  playerName: string;
  teamId: string;
  teamName: string;
  value: number; // El JSON real usa "value" tanto para goles como asistencias o vallas invictas
}

export interface TournamentStatsData {
  totalMatches: number;
  totalGoals: number;
  avgGoalsPerMatch: number;
  champion: BaseTeamPlacement;
  runnerUp: BaseTeamPlacement;
  thirdPlace: BaseTeamPlacement;
  fourthPlace: BaseTeamPlacement;
  topScorers: LeaderboardItem[];
  topAssists: LeaderboardItem[];
  bestGoalkeepers: LeaderboardItem[];
  cleanSheetLeaders: LeaderboardItem[];
  topPlayerOfMatch: LeaderboardItem;
  cards: {
    totalYellowCards: number;
    totalRedCards: number;
  };
}