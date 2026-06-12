import { Injectable, Logger } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AbstractBaseService } from './abstract-base.service';
import { LanguageEnum } from './model/language.enum';
import { WorldCupApiService } from './world-cup-api.service';
import type { GameDictionaryApiResponse, SquadPlayerApiItem } from '../teams/services/model/squad-service.interface';
import type { TeamHistoryApiResponse } from '../teams/services/model/team-history-service.interface';
import type {CurrentWorldCupApiResponse,TeamCatalogApiItem,TeamStatsApiResponse,} from '../world-cup/services/model/simulation-service.interface';
import type { HistoricalRivalApiItem } from '../teams/services/model/rivals-service.interface';import { CoachApiItem } from 'src/teams/services/model/coach-service.interface';
import { StrategyApiItem } from 'src/teams/services/model/strategy-service.interface';
import { FormationApiItem } from 'src/teams/services/model/formation-service.interface';
import { TournamentStatsData,AwardItem, PlayerStatsItem } from '../world-cup/services/model/stats-awards.interface';
import { MatchStrategyApiItem, MatchFormationApiItem, SelectMatchStrategyApiResponse, SelectMatchFormationApiResponse } from '../match/services/helpers/match-tactics.interface';
import { N8nAiProvider  } from '../n8n/n8nAutomationService'; 
import { MatchResponse } from '../match/services/helpers/play-final.interface';


@Injectable()
export class WorldCupFeatureApiService extends AbstractBaseService {
  constructor(
    worldCupApiService: WorldCupApiService,
    adminService: AdminService,
    private readonly N8nAiProvider: N8nAiProvider 
  ) {
    super(adminService, worldCupApiService);
  }

  public getCurrentTeamId(): string {
    return super.getCurrentTeamId();
  }

  public getCurrentLang(): LanguageEnum {
    return super.getCurrentLang();
  }

  public async getTeamPlayers(teamId: string, lang?: string): Promise<SquadPlayerApiItem[]> {
    return this.getEndpointData<SquadPlayerApiItem[]>(`/teams/${teamId}/players`, {
      lang: this.resolveLang(lang),
    });
  }

  public async getGameDictionary(lang?: string): Promise<GameDictionaryApiResponse> {
    return this.getEndpointData<GameDictionaryApiResponse>('/reference/game-dictionary', {
      lang: this.resolveLang(lang),
    });
  }

  public async getTeamHistory(teamId: string, lang?: string): Promise<TeamHistoryApiResponse> {
    return this.getEndpointData<TeamHistoryApiResponse>(`/teams/${teamId}/history`, {
      lang: this.resolveLang(lang),
    });
  }

  public async listTeams(teamId?: string, name?: string): Promise<TeamCatalogApiItem[]> {
    return this.getEndpointData<TeamCatalogApiItem[]>('/teams', {
      teamId: teamId?.trim().toLowerCase(),
      name: name?.trim(),
    });
  }

  public async getTeamStats(teamId: string, lang?: string): Promise<TeamStatsApiResponse> {
    return this.getEndpointData<TeamStatsApiResponse>(`/teams/${teamId}/stats`, {
      lang: this.resolveLang(lang),
    });
  }

  public async getCurrentWorldCup(lang?: string): Promise<CurrentWorldCupApiResponse> {
    return this.getEndpointData<CurrentWorldCupApiResponse>('/world-cup/current', {
      lang: this.resolveLang(lang),
    });
  }

  public async simulateWorldCup(teamId: string, lang?: string): Promise<CurrentWorldCupApiResponse> {
    return this.postEndpointData<CurrentWorldCupApiResponse>('/world-cup/simulate', {
      teamId: teamId?.trim().toLowerCase(),
      lang: this.resolveLang(lang),
    });
  }

  public async getTeamJourney(teamId: string, lang?: string): Promise<unknown> {
    return this.getEndpointData<unknown>(`/world-cup/current/teams/${teamId}/journey`, {
      lang: this.resolveLang(lang),
    }); 
  }     

  public async getHistoricalRivals(teamId: string): Promise<HistoricalRivalApiItem[]> {
    const path = `/teams/${teamId.toLowerCase()}/rivals`;
    return this.getEndpointData<HistoricalRivalApiItem[]>(path);
  }

  public async getTeamDetailById(teamId: string): Promise<any> {
    return this.getEndpointData<any>('/teams', {
      teamId: teamId.trim().toLowerCase(),
    });
  }
  public async getTeamCoaching(teamId: string): Promise<CoachApiItem> {
    return this.getEndpointData<CoachApiItem>(`/teams/coaches`, {
      teamId: teamId
    });
  }

  public async getTeamStrategy(teamId: string): Promise<StrategyApiItem> {
    return this.getEndpointData<StrategyApiItem>(`/teams/{teamId}/strategy`, {
      teamId: teamId
    });
  }

  public async getTeamFormation(teamId: string): Promise<FormationApiItem> {
    return this.getEndpointData<FormationApiItem>(`/teams/{teamId}/formation`, {
      teamId: teamId
    });
  }
  public async getCurrentGroups(): Promise<any[]> {
    return this.getEndpointData<any[]>('/world-cup/current/groups');
  }


  public async startFinal(teamId: string, lang?: string): Promise<any> {
    return this.postEndpointData('/match/start-final', {
      teamId,
      lang: this.resolveLang(lang),
    });
    
  }

  public async playMatch(matchId: string, selectedOption: string, lang?: string): Promise<MatchResponse> {
   return  this.postEndpointData<any>('/match/play', {
      matchId,
      selectedOption,
      lang: this.resolveLang(lang),
    });
   
  }


  public async getMatchStrategies(lang?: string): Promise<MatchStrategyApiItem[]> {
    return this.getEndpointData<MatchStrategyApiItem[]>('/match/strategies', {
      lang: this.resolveLang(lang),
    });
  }

  public async getMatchFormations(lang?: string): Promise<MatchFormationApiItem[]> {
    return this.getEndpointData<MatchFormationApiItem[]>('/match/formations', {
      lang: this.resolveLang(lang),
    });
  }


  public async selectMatchStrategy(
    teamId: string, 
    strategy: string, 
    lang?: string
  ): Promise<SelectMatchStrategyApiResponse> {
    return this.postEndpointData<SelectMatchStrategyApiResponse>('/match/select-strategy', {
      teamId: teamId.trim().toLowerCase(),
      strategy,
      lang: this.resolveLang(lang),
    });
  }


  public async selectMatchFormation(
    teamId: string, 
    formation: string, 
    lang?: string
  ): Promise<SelectMatchFormationApiResponse> {
    return this.postEndpointData<SelectMatchFormationApiResponse>('/match/select-formation', {
      teamId: teamId.trim().toLowerCase(),
      formation,
      lang: this.resolveLang(lang),
    });
  }


  public async getTournamentStats(lang?: string): Promise<TournamentStatsData> {
    return this.getEndpointData<TournamentStatsData>('/world-cup/current/stats', {
      lang: this.resolveLang(lang),
    });
  }

  public async getTournamentAwards(lang?: string): Promise<AwardItem[]> {
    return this.getEndpointData<AwardItem[]>('/world-cup/current/awards', {
      lang: this.resolveLang(lang),
    });
  }

  public async getPlayerDetailedStats(teamId?: string): Promise<PlayerStatsItem[]> {
    return this.getEndpointData<PlayerStatsItem[]>('/world-cup/current/player-stats', {
      teamId: teamId?.trim().toLowerCase(),
    });
  }
  
  public async  getMatchCurrentStats(lang?: string): Promise<MatchResponse> {
    return this.getEndpointData<MatchResponse>('/match/current/stats', {
      lang: this.resolveLang(lang),
    });
  }

public async generateReply_n8n(matchData: MatchResponse): Promise<any> {
  try {
    const n8nResponse = await this.N8nAiProvider.generateReply({
      conversationId: matchData.matchId,
  
      conversationTitle: `Partido Final: ${matchData.teamName || 'Local'} vs ${matchData.opponentName || 'Visitante'}`,
      
      latestUserMessage: JSON.stringify(matchData),
      
      recentMessages: [
        {
          role: 'USER' as any,
          content: `Marcador actual: ${matchData.score}, Turno: ${matchData.turn}, Minuto: ${matchData.minute}`,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    console.log(`Respuesta de n8n recibida con éxito: ${n8nResponse}`);
    return n8nResponse;
  } catch (n8nError) {
    const errorInstance = n8nError as Error;
    console.error(`[n8n Automation Error]: ${errorInstance.message}`);
    return undefined;
  }
}
}