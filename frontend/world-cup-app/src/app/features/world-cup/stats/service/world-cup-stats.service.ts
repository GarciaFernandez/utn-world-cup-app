import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { UiVisualsService } from '../../../../core/services/ui-visuals.service';
import { WorldCupStatsViewModel } from '../model/world-cup-stats-view-model.interface';
import { WorldCupStatsApiResponse, StatsAwardItem } from '../model/world-cup-stats-api.interface';

@Injectable({ providedIn: 'root' })
export class WorldCupStatsService extends BaseApiService {
  private readonly uiVisuals = inject(UiVisualsService);
  
  private readonly pageState: WorldCupStatsViewModel = {
    lang: 'es',
    loading: true,
    errorMessage: '',
    showNoDataState: false,
    totalMatches: 0,
    totalGoals: 0,
    avgGoalsPerMatch: 0,
    totalYellowCards: 0,
    totalRedCards: 0,
    podium: [],
    topScorers: [],
    topAssists: [],
    awards: []
  };

  public get vm(): WorldCupStatsViewModel {
    return this.pageState;
  }


  public loadStatsAndAwards(): Observable<void> {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';
    this.pageState.showNoDataState = false;

    return forkJoin({
      statsResponse: this.get<WorldCupStatsApiResponse>('/world-cup/current/stats'),
      awardsResponse: this.get<StatsAwardItem[]>('/world-cup/current/awards')
    }).pipe(
      map((res) => {
        const statsObj = res.statsResponse as any;
        const statsData = statsObj?.data || statsObj;
        
        const awardsObj = res.awardsResponse as any;
        const awardsData = awardsObj?.data || awardsObj;

        if (!statsData) {
          this.pageState.showNoDataState = true;
          this.pageState.loading = false;
          return;
        }

        this.pageState.totalMatches = statsData.totalMatches || 0;
        this.pageState.totalGoals = statsData.totalGoals || 0;
        this.pageState.avgGoalsPerMatch = statsData.avgGoalsPerMatch || 0;
        this.pageState.totalYellowCards = statsData.cards?.totalYellowCards || statsData.totalYellowCards || 0;
        this.pageState.totalRedCards = statsData.cards?.totalRedCards || statsData.totalRedCards || 0;

        this.pageState.podium = [
          {
            place: 'CHAMPION',
            placeLabel: 'Campeón',
            medal: this.uiVisuals.getFinalChatMessageIcon('CHAMPION'),
            teamId: statsData.champion?.teamId,
            teamName: statsData.champion?.teamName,
            flag: this.uiVisuals.getTeamFlag(statsData.champion?.teamId)
          },
          {
            place: 'RUNNER_UP',
            placeLabel: 'Subcampeón',
            medal: this.uiVisuals.getFinalChatMessageIcon('RUNNER_UP'),
            teamId: statsData.runnerUp?.teamId,
            teamName: statsData.runnerUp?.teamName,
            flag: this.uiVisuals.getTeamFlag(statsData.runnerUp?.teamId)
          },
          {
            place: 'THIRD_PLACE',
            placeLabel: 'Tercer Puesto',
            medal: this.uiVisuals.getFinalChatMessageIcon('THIRD_PLACE'),
            teamId: statsData.thirdPlace?.teamId,
            teamName: statsData.thirdPlace?.teamName,
            flag: this.uiVisuals.getTeamFlag(statsData.thirdPlace?.teamId)
          }
        ];

        this.pageState.topScorers = (statsData.topScorers || []).map((item: any, idx: number) => ({
          rank: idx + 1,
          playerName: item.playerName,
          teamId: item.teamId,
          teamName: item.teamName,
          teamFlag: this.uiVisuals.getTeamFlag(item.teamId),
          value: item.value
        }));

        this.pageState.topAssists = (statsData.topAssists || []).map((item: any, idx: number) => ({
          rank: idx + 1,
          playerName: item.playerName,
          teamId: item.teamId,
          teamName: item.teamName,
          teamFlag: this.uiVisuals.getTeamFlag(item.teamId),
          value: item.value
        }));

        this.pageState.awards = (awardsData || []).map((award: StatsAwardItem) => ({
          code: award.code,
          title: (award.code || '').replace('_', ' '),
          icon: this.uiVisuals.getAwardIcon(award.code),
          winnerName: award.winnerName,
          teamId: award.teamId,
          teamName: award.teamName,
          teamFlag: this.uiVisuals.getTeamFlag(award.teamId),
          reason: award.reason
        }));

        this.pageState.loading = false;
      }),
      catchError((err) => {
        console.error('Error procesando estadísticas con BaseApiService:', err);
        this.pageState.errorMessage = 'No se pudieron procesar las estadísticas finales. Es probable que aun no haya terminado la final';
        this.pageState.loading = false;
        return of(void 0);
      })
    );
  }
}