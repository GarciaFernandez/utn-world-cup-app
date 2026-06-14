export interface TeamApiItem {
  id: string;
  name: string;
  strategy: string;
  formation: string;
  coachName: string;
  coachProfile: string;
}

interface TacticalLineApiItem {
  attack: number;
  defense: number;
  midfield: number;
}

export interface SquadPlayerApiItem {
  playerId: string;
  name: string;
  position: string;
  shirtNumber: number;
  age: number;
  energy: number;
  isCaptain: boolean;
  isStarter: boolean;
  isOnField: boolean;
  yellowCards: number;
  redCard: boolean;
  isInjured: boolean;
}

export interface TeamSquadApiItem {
  id: string;
  name: string;
  formation: string | null;
  strategy: string | null;
  coachName: string | null;
  coachProfile: string | null;
  tacticalBreakdown: { effectiveTeamLine: TacticalLineApiItem } | null;
  maxSubstitutions: number;
  substitutionsUsed: number;
  remainingSubstitutions: number;
  onFieldCount: number;
  onField: SquadPlayerApiItem[];
  bench: SquadPlayerApiItem[];
}

export interface MatchSquadApiResponse {
  matchId: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  score: string;
  team: TeamSquadApiItem;
  opponent: TeamSquadApiItem;
}

export interface TeamStateMappedItem {
  id: string;
  name: string;
  flag: string;
  formation: string;
  strategy: string;
  strategyLabel: string;
  coachName: string;
  coachProfile: string;
  tactical: TacticalLineApiItem;
  maxSubstitutions: number;
  substitutionsUsed: number;
  remainingSubstitutions: number;
  onFieldCount: number;
  onField: SquadPlayerApiItem[];
  bench: SquadPlayerApiItem[];
}

export interface TeamStateMappedResponse {
  matchId: string;
  teamId: string;
  lang: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  score: string;
  team: TeamStateMappedItem;
  opponent: TeamStateMappedItem;
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