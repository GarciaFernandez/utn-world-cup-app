export class CoachAndStrategyResponse {
  public coach: CoachModel;
  public strategy: CoachingTeamStrategy;
  public formation: CoachingTeamFormation;
  public stats: CoachingTeamStats;
  public strategies: CoachingStrategyCatalogItem[];
  public formations: CoachingFormationCatalogItem[];
  public baseRatings: CoachingTeamRatingItem[];
}

export class CoachModel { 
  public coachId: string;
  public teamId: string;
  public name: string;
  public age: number;
  public nationality: string;
  public profile: string;
  public profileLabel: string;
  public profileDescription: string;
  public riskAppetite: number;
  public gameManagement: number;
  public adaptability: number;
  public pressingBias: number;
  public possessionBias: number;
  public defenseBias: number;
  public maxStrategyChanges: number;

  constructor(data: {
    coachId: string;
    teamId: string;
    name: string;
    age: number;
    nationality: string;
    profile: string;
    profileLabel: string;
    profileDescription: string;
    riskAppetite: number;
    gameManagement: number;
    adaptability: number;
    pressingBias: number;
    possessionBias: number;
    defenseBias: number;
    maxStrategyChanges: number;

  }) {
    this.coachId = data.coachId;
    this.teamId = data.teamId;
    this.name = data.name;
    this.age = data.age;
    this.nationality = data.nationality;
    this.profile = data.profile;
    this.profileLabel = data.profileLabel;
    this.profileDescription = data.profileDescription;
    this.riskAppetite = data.riskAppetite;
    this.gameManagement = data.gameManagement;
    this.adaptability = data.adaptability;
    this.pressingBias = data.pressingBias;
    this.possessionBias = data.possessionBias;
    this.defenseBias = data.defenseBias;
    this.maxStrategyChanges = data.maxStrategyChanges;
  }
}

export class CoachingTeamStrategy {
  teamId: string;
  strategy: string;


  constructor(strategy: {
    teamId: string;
    strategy: string;
  }) {
    this.teamId = strategy.teamId;
    this.strategy = strategy.strategy;
  }
}

export class  CoachingTeamFormation {
  teamId: string;
  formation: string;

  constructor(formation: {
    teamId: string;
    formation: string;  

}) {
  this.teamId = formation.teamId;
  this.formation = formation.formation;
  }
}


export class CoachingStrategyCatalogItem {
  strategy: string;
  description: string;
  compatibleFormations: string[];
  strategyLineImpact?: CoachingStrategyLineImpact;

  constructor(strategyCatalog: {
    strategy: string;
    description: string;
    compatibleFormations: string[];
    strategyLineImpact?: CoachingStrategyLineImpact;

}) {
  this.strategy = strategyCatalog.strategy;
  this.description = strategyCatalog.description;
  this.compatibleFormations = strategyCatalog.compatibleFormations;
  this.strategyLineImpact = strategyCatalog.strategyLineImpact;
  }
}

export interface CoachingStrategyLineImpact {
  attack: number;
  defense: number;
  midfield: number;
}

export class CoachingFormationCatalogItem {
  formation: string;
  description: string;
  compatibleStrategies: string[]; 

  constructor(formationCatalog: {
    formation: string;
    description: string;
    compatibleStrategies: string[];
  }) {
    this.formation = formationCatalog.formation;
    this.description = formationCatalog.description;
    this.compatibleStrategies = formationCatalog.compatibleStrategies;
  }
}

export interface CoachingCompatibility {
  selectedStrategy: string;
  selectedFormation: string;
  compatibleFormations: string[];
  compatibleStrategies: string[];
  byStrategy: Record<string, string[]>;
  byFormation: Record<string, string[]>;
  isSelectedPairCompatible: boolean;
}

export class CoachingTeamRatingItem {
  metric: string;
  value: number;

  constructor(teamRating: {
    metric: string;
    value: number;
  }) {
    this.metric = teamRating.metric;
    this.value = teamRating.value;
  }
}

export class CoachingTeamRatingDeltaItem {
  metric: string;
  strategyDelta: number;
  compatibilityPenalty: number;
  totalDelta: number;

  constructor(ratingDelta: {
    metric: string;
    strategyDelta: number;
    compatibilityPenalty: number;
    totalDelta: number;
} ) {
  this.metric = ratingDelta.metric;
  this.strategyDelta = ratingDelta.strategyDelta;
  this.compatibilityPenalty = ratingDelta.compatibilityPenalty;
  this.totalDelta = ratingDelta.totalDelta;
  }
}

export class CoachingTeamStats {
  attack: number;
  defense: number;
  midfield: number;
  overall: number;
  current_strategy: string;
  current_formation: string;
}

export class CoachingStrategyCatalogItemApiResponse {
  strategy: string;
  description: string;
  compatibleFormations: string[];
  strategyLineImpact?: CoachingStrategyLineImpact;
}