import { inject, Injectable } from '@angular/core';
import { CoachingViewModel } from '../model/coaching-view-model.interface';
import { combineLatest, tap, switchMap, Observable, map, catchError, finalize, of } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { CoachingCoach, CoachingTeamStrategy } from '../model/coaching-api.interface';

@Injectable({ providedIn: 'root' })
export class CoachingService extends BaseApiService {
    private readonly adminService = inject(AdminService);

    private readonly pageState: CoachingViewModel = {
      lang: 'es',
      loading: false,
      savingStrategy: false,
      savingFormation: false,
      savingResetDefault: false,
      errorMessage: '',
      selectedTeamLabel: '',
      coach: {
        coachId: '',
        teamId: '',
        teamName: '',
        name: '',
        age: 0,
        nationality: '',
        profile: '',
        riskAppetite: 0,
        gameManagement: 0,
        adaptability: 0,
        pressingBias: 0,
        possessionBias: 0,
        defenseBias: 0,
        maxStrategyChanges: 0
      },
      strategy: {
        teamId: '',
        strategy: ''
      },
      formation: {
        teamId: '',
        formation: ''
      },
      stats: {
        attack: 0,
        defense: 0,
        midfield: 0,
        overall: 0,
        current_strategy: '',
        current_formation: ''
      },
      strategies: [],
      formations: [],
      selectedStrategy: '',
      selectedFormation: '',
      selectedStrategyDescription: '',
      compatibleFormations: [],
      compatibleStrategies: [],
      baseRatings: [],
      effectiveRatings: [],
      ratingDeltas: [],
      strategyPenalty: 0,
      isSelectedFormationCompatible: false,
      tacticalStatusTone: 'original',
      tacticalStatusLabelKey: '',
      searchTerm: function (searchTerm: any, positionFilter: any) {
        throw new Error('Function not implemented.');
      },
      positionFilter: function (searchTerm: any, positionFilter: any) {
        throw new Error('Function not implemented.');
      }
    }; 

    private hasInitialized = false; 

    getViewModel(): CoachingViewModel {
      return this.pageState;
    }

  initialize(): void { 
    // Si ya arrancó, solo recarga los datos sin duplicar escuchas
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    this.pageState.lang = this.getCurrentLang();
    this.pageState.selectedTeamLabel = this.adminService.getCurrentTeam()?.name ?? 'ARG';

    // Sincroniza el nombre del país en la cabecera si se cambia en el panel administrador
    this.adminService.currentTeam$.subscribe((team) => {
      this.pageState.selectedTeamLabel = team?.name ?? 'ARG';
    });

    // Combina los cambios de equipo e idioma para disparar la petición HTTP automáticamente
    combineLatest([this.appContextService.currentTeamId$, this.appContextService.lang$])
      .pipe(
        tap(([lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(([teamId]) => combineLatest([
          this.loadCoaching(teamId)
          ]).pipe(map(() => undefined))) // Muta el evento global en la llamada al backend
      )
      .subscribe();

      
  }

   private loadCoaching(teamId: string): Observable<void> {
      this.pageState.loading = true;
      this.pageState.errorMessage = '';

      return this.get<CoachingCoach>(`/my-team/coach?teamId=${teamId}`).pipe(
      map((response) => response?.data),
      tap((data) => {
        this.pageState.coach = data ?? null;
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.coach = null;
        this.pageState.errorMessage = 'No se pudo cargar el cuerpo tecnico. Intente nuevamente.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }

  private loadStrategy(teamId: string): Observable<void> {
      this.pageState.loading = true;
      this.pageState.errorMessage = '';

      return this.get<CoachingTeamStrategy>(`/my-team/strategy?teamId=${teamId}`).pipe(
      map((response) => response?.data),
      tap((data) => {
        this.pageState.strategy = data ?? null;
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.strategy = null;
        this.pageState.errorMessage = 'No se pudo cargar la estrategia. Intente nuevamente.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }
}

