export interface TeamApiItem {
  id: string;
  name: string;
  strategy: string;
  formation: string;
  coachName: string;
  coachProfile: string;
}

export interface MatchSummaryApiItem {
  teamGoals: number;
  opponentGoals: number;
  teamYellowCards: number;
  teamRedCards: number;
  opponentYellowCards: number;
  opponentRedCards: number;
}

export interface MatchEventApiItem {
  statId: number;
  minute: number;
  turn: number;
  eventType: string;
  zone: string;
  action: string;
  teamId: string;
  teamName: string;
  playerName: string;
  playerPosition: string;
  cardType: string;
  isGoal: boolean;
  message: string;
  creationDate: string; 
}

export interface MatchDataApiItem {
  matchId: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  score: string;
  team: TeamApiItem;
  opponent: TeamApiItem;
  summary: MatchSummaryApiItem;
  events: MatchEventApiItem[];
}