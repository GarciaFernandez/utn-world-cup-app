export interface BaseServerResponse<T> {
  serverTime: string;
  data: T;
  responseMessage: {
    messageCode: string;
    message: string;
  };
  success: boolean;
}

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

export interface BaseTeamPlacement {
  teamId: string;
  teamName: string;
}

export interface LeaderboardItem {
  playerName: string;
  teamId: string;
  teamName: string;
  value: number; 
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