
export interface MatchStrategyImpactApiItem {
  attack: number;
  defense: number;
  midfield: number;
}

export interface MatchStrategyApiItem {
  strategy: string;
  description: string;
  compatibleFormations: string[];
  strategyLineImpact: MatchStrategyImpactApiItem;
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

export interface ResetTeamTacticsApiResponse {
  teamId: string;
  strategy: string;
  formation: string;
  message: string;
}