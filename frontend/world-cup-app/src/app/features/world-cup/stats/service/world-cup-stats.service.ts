import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiService } from '../../../../core/services/base-api.service'; // Ajustá según tus carpetas
import { UiVisualsService } from '../../../../core/services/ui-visuals.service'; // Ajustá según la ruta real de tu archivo
import { WorldCupStatsViewModel } from '../model/world-cup-stats-view-model.interface';
import { WorldCupStatsApiResponse, StatsAwardItem } from '../model/world-cup-stats-api.interface';

@Injectable({ providedIn: 'root' })
export class WorldCupStatsService extends BaseApiService {
  // Inyectamos el servicio visual oficial de la materia
  private readonly uiVisuals = inject(UiVisualsService);
  
  // Centralizamos el ViewModel del estado de la pantalla
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

  // Exponemos el ViewModel para cumplir con el patrón de arquitectura
  public get vm(): WorldCupStatsViewModel {
    return this.pageState;
  }

  /**
   * Carga y procesa en paralelo la información unificada para la pantalla.
   * Utiliza la infraestructura nativa de BaseApiService y el procesador de UiVisualsService.
   */
  public loadStatsAndAwards(): Observable<void> {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';
    this.pageState.showNoDataState = false;

    // Consumimos los datos tipando las peticiones con las interfaces de la materia
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

        // == 1. Mapeamos el Cuadro de Estadísticas Generales ==
        this.pageState.totalMatches = statsData.totalMatches || 0;
        this.pageState.totalGoals = statsData.totalGoals || 0;
        this.pageState.avgGoalsPerMatch = statsData.avgGoalsPerMatch || 0;
        this.pageState.totalYellowCards = statsData.cards?.totalYellowCards || statsData.totalYellowCards || 0;
        this.pageState.totalRedCards = statsData.cards?.totalRedCards || statsData.totalRedCards || 0;

        // == 2. Mapeamos el Podio Oficial consumiendo únicamente getTeamFlag de UiVisuals ==
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

        // == 3. Mapeamos las Tablas de Líderes (Goleadores y Asistidores) ==
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

        // == 4. Mapeamos la Galería de Premios usando los resolvedores oficiales existentes ==
        this.pageState.awards = (awardsData || []).map((award: StatsAwardItem) => ({
          code: award.code,
          title: (award.code || '').replace('_', ' '),
          icon: this.uiVisuals.getAwardIcon(award.code), // <-- Método oficial de ellos
          winnerName: award.winnerName,
          teamId: award.teamId,
          teamName: award.teamName,
          teamFlag: this.uiVisuals.getTeamFlag(award.teamId), // <-- Método oficial de ellos
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