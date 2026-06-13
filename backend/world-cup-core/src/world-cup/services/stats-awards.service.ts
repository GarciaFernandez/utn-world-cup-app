import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { CurrentWorldCupApiResponse } from '../services/model/simulation-service.interface';
import { 
  TournamentStatsData, 
  AwardItem, 
  PlayerStatsItem 
} from './model/stats-awards.interface';

@Injectable()
export class StatsAwardsService {
  private readonly logger = new Logger(StatsAwardsService.name);
  constructor(private readonly featureApi: WorldCupFeatureApiService) {}

  public async checkWorldCupStatus(): Promise<CurrentWorldCupApiResponse> {
    return await this.featureApi.getCurrentWorldCup();
  }

  public async getStats(): Promise<TournamentStatsData> {
    const currentWc = await this.checkWorldCupStatus();
    
    if (!currentWc || currentWc.status !== 'ENDED') {
      throw new BadRequestException('Las estadísticas estarán disponibles luego de disputar la final.');
    }

    const lang = this.featureApi.getCurrentLang();
  return await this.featureApi.getTournamentStats(lang);
  }

  public async getAwards(): Promise<AwardItem[]> {
    const currentWc = await this.checkWorldCupStatus();
    
    if (!currentWc || currentWc.status !== 'ENDED') {
      throw new BadRequestException('Los premios estarán disponibles luego de disputar la final.');
    }

    const lang = this.featureApi.getCurrentLang();
    return await this.featureApi.getTournamentAwards(lang);
  }

  public async getPlayerStats(teamId?: string): Promise<PlayerStatsItem[]> {

    const activeTeamId = teamId || this.featureApi.getCurrentTeamId();
    
    return await this.featureApi.getPlayerDetailedStats(activeTeamId);
  }
}