export class CoachModel {
  public coachId: string;
  public teamId: string;
  public name: string;
  public age: number;
  public nationality: string;
  public profile: string;
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
    this.riskAppetite = data.riskAppetite;
    this.gameManagement = data.gameManagement;
    this.adaptability = data.adaptability;
    this.pressingBias = data.pressingBias;
    this.possessionBias = data.possessionBias;
    this.defenseBias = data.defenseBias;
    this.maxStrategyChanges = data.maxStrategyChanges;
  }
}