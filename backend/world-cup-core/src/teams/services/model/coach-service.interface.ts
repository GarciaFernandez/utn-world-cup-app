export interface CoachApiItem {
    coachId: string;
    teamId: string;
    name: string;
    age: number;
    nationality: string;
    profile: string;
    riskAppetite: number;
    gameManagement: number;
    adaptability: number;
    pressingBias: number;
    possessionBias: number;
    defenseBias: number;
    maxStrategyChanges: number;

}

export interface StrategyApiItem {
    teamId: string;
    strategy: string;
}

export interface FormationApiItem {
    teamId: string;
    formation: string;
}

export interface CoachProfileApiItem {
    lang: string;
    coachProfiles: CoachProfiles[];
}

export interface CoachProfiles {
    code: string;
    label: string;
    description: string;
    examples: string;
}


export interface CoachingStrategyCatalogApiItem {
  strategy: string;
  description: string;
  compatibleFormations: string[];
  strategyLineImpact?: CoachingStrategyLineImpact;
}

export interface CoachingStrategyLineImpact {
  attack: number;
  defense: number;
  midfield: number;
}

export interface CoachingFormationCatalogApiItem {
  formation: string;
  description: string;
  compatibleStrategies: string[];
}

export interface coachingCompatibilityApiItem {
  strategy: string;
  formation: string;
  compatibility: number;
}