export class FormationModel{
    public teamId: string;
    public formation: string;

constructor(data: {
    teamId: string;
    formation: string;
  }) {
    this.teamId = data.teamId;
    this.formation = data.formation;
  }
}