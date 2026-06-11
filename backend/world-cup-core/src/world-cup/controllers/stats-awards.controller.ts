import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsAwardsService } from '../services/stats-awards.service';
import { CurrentWorldCupApiResponse } from '../services/model/simulation-service.interface';
import { TournamentStatsData,AwardItem,PlayerStatsItem } from '../services/model/stats-awards.interface';

@ApiTags('world-cup')
@Controller('world-cup')
export class StatsAwardsController {
  constructor(private readonly statsAwardsService: StatsAwardsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Verificar el estado del mundial actual' })
  public async getCurrentWorldCup(): Promise<CurrentWorldCupApiResponse> {
    return await this.statsAwardsService.checkWorldCupStatus();
  }

  @Get('current/stats')
  @ApiOperation({ summary: 'Obtener estadísticas agregadas del torneo' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas.' })
  public async getStats(): Promise<TournamentStatsData> {
    return await this.statsAwardsService.getStats();
  }

  @Get('current/awards')
  @ApiOperation({ summary: 'Obtener la galería de premios individuales de la copa' })
  @ApiResponse({ status: 200, description: 'Premios obtenidos.' })
  public async getAwards(): Promise<AwardItem[]> {
    return await this.statsAwardsService.getAwards();
  }

  @Get('current/player-stats')
  @ApiOperation({ summary: 'Obtener estadísticas detalladas por jugador' })
  public async getPlayerStats(): Promise<PlayerStatsItem[]> {
    // Ya no recibimos nada por @Query, delegamos la carga automática al servicio
    return await this.statsAwardsService.getPlayerStats();
  }
}