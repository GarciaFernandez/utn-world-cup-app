import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { AdminService } from '../../admin/admin.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { MatchResponse } from './helpers/play-final.interface';
import { 
  MatchStrategyApiItem, 
  MatchFormationApiItem, 
  SelectMatchStrategyApiResponse, 
  SelectMatchFormationApiResponse 
} from '../services/helpers/match-tactics.interface';

@Injectable()
export class PlayFinalService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async startFinal(customTeamId?: string, lang?: string): Promise<MatchResponse> {
    try {
      const teamId = customTeamId?.trim().toLowerCase() || this.getCurrentTeamId();
      const response = await this.worldCupFeatureApiService.startFinal(teamId, lang);
      
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error; 
      throw new HttpException('Error al iniciar la final de la copa del mundo.', HttpStatus.BAD_GATEWAY);
    }
  }

  public async playTurn(matchId: string, selectedOption: string, lang?: string): Promise<MatchResponse> {
    try {
      const response = await this.worldCupFeatureApiService.playMatch(matchId, selectedOption, lang);

      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al procesar el turno del partido.', HttpStatus.BAD_GATEWAY);
    }
  }

  /** Obtiene las estrategias disponibles de acuerdo al partido corriente */
  public async getMatchStrategies(lang?: string): Promise<MatchStrategyApiItem[]> {
    try {
      const activeLang = lang || this.getCurrentLang();
      const response = await this.worldCupFeatureApiService.getMatchStrategies(activeLang);
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener las estrategias disponibles del partido.', HttpStatus.BAD_GATEWAY);
    }
  }


  public async getMatchFormations(lang?: string): Promise<MatchFormationApiItem[]> {
    try {
      const activeLang = lang || this.getCurrentLang();
      const response = await this.worldCupFeatureApiService.getMatchFormations(activeLang);
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener las formaciones disponibles del partido.', HttpStatus.BAD_GATEWAY);
    }
  }

  public async selectMatchStrategy(customTeamId?: string, strategy?: string, lang?: string): Promise<SelectMatchStrategyApiResponse> {
    try {
      const teamId = customTeamId?.trim().toLowerCase() || this.getCurrentTeamId();
      const response = await this.worldCupFeatureApiService.selectMatchStrategy(teamId, strategy, lang);
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar la estrategia en medio del partido.', HttpStatus.BAD_GATEWAY);
    }
  }

  public async selectMatchFormation(customTeamId?: string, formation?: string, lang?: string): Promise<SelectMatchFormationApiResponse> {
    try {
      const teamId = customTeamId?.trim().toLowerCase() || this.getCurrentTeamId();
      const response = await this.worldCupFeatureApiService.selectMatchFormation(teamId, formation, lang);
      const data = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar la formación en medio del partido.', HttpStatus.BAD_GATEWAY);
    }
  }
}