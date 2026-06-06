import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { AdminService } from '../../admin/admin.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { MatchResponse } from './helpers/play-final.interface';

@Injectable()
export class PlayFinalService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  /** Inicia el partido de la final en la API externa */
  public async startFinal(customTeamId?: string, lang?: string): Promise<MatchResponse> {
    try {
      const teamId = customTeamId?.trim().toLowerCase() || this.getCurrentTeamId();
      const response = await this.worldCupFeatureApiService.startFinal(teamId, lang);
      
      // Desempaquetamos de forma segura usando la arquitectura genérica de tu grupo
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error; 
      throw new HttpException('Error al iniciar la final de la copa del mundo.', HttpStatus.BAD_GATEWAY);
    }
  }

  /** Juega un turno del partido de la final */
  public async playTurn(matchId: string, selectedOption: string, lang?: string): Promise<MatchResponse> {
    try {
      const response = await this.worldCupFeatureApiService.playMatch(matchId, selectedOption, lang);
      
      // Desempaquetamos la data limpia del turno
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al procesar el turno del partido.', HttpStatus.BAD_GATEWAY);
    }
  }
}