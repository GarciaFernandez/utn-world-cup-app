export interface MatchOption {
  index: number;
  action: string;
  label: string;
}

export interface MatchMessageItem {
  messageKey: string | null;
  type: string; // 'PLAYER_ACTION', 'CONTEXT', 'RESULT', 'INFO', etc.
  text: string;
  minute: number;
  turn: number;
  teamId: string | null;
  teamName: string | null;
  playerName: string | null;
}

export interface PlayerSnapshot {
  playerId: string;
  name: string;
  position: string;
  shirtNumber: number;
  age: number;
  skill: number;
  attack: number;
  defense: number;
  energy: number;
  isCaptain: boolean;
}

export interface MatchCurrentContext {
  matchId: string;
  turn: number;
  minute: number;
  eventType: string;
  zone: string;
  possession: string;
  userTeamId: string;
  userTeamName: string;
  opponentTeamId: string;
  opponentTeamName: string;
  actingTeamId: string;
  actingTeamName: string;
  defendingTeamId: string;
  defendingTeamName: string;
  actingPlayer: PlayerSnapshot;
  teammatesInZone: PlayerSnapshot[];
  opponentsInZone: PlayerSnapshot[];
  availableActions: string[];
  isPendingSetPiece: boolean;
  isRivalryMatch: boolean;
  lastAction: string;
  lastOutcome: string;
}

export interface MatchResponse {
  matchId: string;
  teamId: string;
  opponentId: string;
  teamName: string;
  opponentName: string;
  messageItems: MatchMessageItem[];
  score: string;
  minute: number;
  turn: number;
  zone: string;
  possession: string;
  ballCarrier: string;
  teamStrategy: string | null;
  teamFormation: string | null;
  teamCoachName: string | null;
  opponentStrategy: string | null;
  opponentFormation: string | null;
  opponentCoachName: string | null;
  eventType: string;
  options: MatchOption[];
  isFinished: boolean;
  result: string | null;
  currentContext?: MatchCurrentContext | null;
}