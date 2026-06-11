export interface FinalChatOptionApiItem {
  index: number;
  action: string;
  label: string;
}

export interface FinalChatMessageApiItem {
  type: string;
  text: string;
  minute: number;
  turn: number;
  teamId: string | null;
  teamName: string | null;
  playerName: string | null;
  bubbleRole: 'system' | 'bot' | 'user';
  icon: string;
}

export interface FinalChatStrategyCatalogApiItem {
  strategy: string;
  strategyLabel: string;
  description: string;
}

export interface FinalChatFormationCatalogApiItem {
  formation: string;
  description: string;
}

export interface FinalChatApiResponse {
  teamId: string;
  opponentId?: string;
  lang: 'es' | 'en';
  matchId: string;
  isFinished: boolean;
  result: string | null;
  minute: number;
  turn: number;
  score: string;
  zone: string | null;
  zoneLabel: string;
  possession: string;
  ballCarrier: string;
  eventType: string;
  eventTypeLabel?: string;
  teamName: string;
  teamFlag: string;
  opponentName: string;
  opponentFlag: string;
  teamCoachName: string;
  teamCoachProfile: string;
  teamStrategy: string;
  teamStrategyLabel: string;
  teamFormation: string;
  opponentCoachName: string;
  opponentCoachProfile: string;
  opponentStrategy: string;
  opponentStrategyLabel: string;
  opponentFormation: string;
  options: FinalChatOptionApiItem[];
  canPlay: boolean;
  messageItems: FinalChatMessageApiItem[];
  strategyCatalog: FinalChatStrategyCatalogApiItem[];
  formationCatalog: FinalChatFormationCatalogApiItem[];
  onFieldSummary: string[];
}

export interface FinalChatTeamsPreviewApiResponse {
  teamId: string;
  opponentId: string;
  teamName: string;
  teamFlag: string;
  opponentName: string;
  opponentFlag: string;
  worldCupStatus: string;
}

export interface MatchStrategyApiItem {
  strategy: string;
  description: string;
  compatibleFormations: string[];
}

export interface MatchFormationApiItem {
  formation: string;
  description: string;
  compatibleStrategies: string[];
}

export interface SelectMatchStrategyApiResponse {
  teamId: string;
  strategy: string;
  formation: string;
  formationAutoAdjusted: boolean;
  message: string;
}

export interface SelectMatchFormationApiResponse {
  teamId: string;
  formation: string;
  message: string;
}