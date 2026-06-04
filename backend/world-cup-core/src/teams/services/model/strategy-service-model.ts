export class StrategyModel{
    public teamId: string;
    public strategy: string;

constructor(data: {
    teamId: string;
    strategy: string;
  }) {
    this.teamId = data.teamId;
    this.strategy = data.strategy;
  }
}
