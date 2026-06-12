import { inject, Injectable } from '@angular/core';
import { CoachingViewModel } from '../model/coaching-view-model.interface';
import { combineLatest, tap, switchMap, Observable, map, catchError, finalize, of } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { AdminService } from 'src/app/shared/admin/service/admin.service';
import { CoachingOverviewData } from '../model/coaching-api.interface';

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

  public onStrategyChange(strategy: string): void {
  this.pageState.selectedStrategy = strategy;
  this.pageState.selectedStrategyDescription =
    this.pageState.strategies.find(s => s.strategy === strategy)?.description ?? '';

  const cambioStrat = this.pageState.strategies.find(s => s.strategy === strategy);
  this.pageState.compatibleFormations = cambioStrat?.compatibleFormations ?? [];

  this._recalcCompatibilityStatus();
  this._recalcRatings();  // ← agregar esto
}

public onFormationChange(formation: string): void {
  this.pageState.selectedFormation = formation;

  const cambioForm = this.pageState.formations.find(f => f.formation === formation);
  this.pageState.compatibleStrategies = cambioForm?.compatibleStrategies ?? [];

  this._recalcCompatibilityStatus();
  this._recalcRatings();  // ← agregar esto
}

  // ─── Guardar táctica (estrategia + formación) ─────────────────────────────

 public saveStrategy(): void {
  const teamId = this.adminService.getCurrentTeam()?.teamId ?? '';
  if (!teamId || !this.pageState.selectedStrategy) return;

  this.pageState.savingStrategy = true;
  this.pageState.savingFormation = true;  // ← activar ambos

  this.post<void>('/my-team/saveStrategy', {
    teamId,
    strategy: this.pageState.selectedStrategy,
    lang: this.pageState.lang  // ← incluir lang
  }).pipe(
    catchError(() => {
      this.pageState.errorMessage = 'No se pudo guardar la estrategia.';
      return of(null);  // ← cortar el pipe sin explotar
    }),
    switchMap((result) => {
      if (result === null) return of(null); // si falló la estrategia, no seguir
      return this.post<void>('/my-team/saveFormation', {
        teamId,
        formation: this.pageState.selectedFormation,
        lang: this.pageState.lang
      }).pipe(
        catchError(() => {
          this.pageState.errorMessage = 'Estrategia guardada, pero falló la formación.';
          return of(null);
        })
      );
    }),
    tap((result) => {
      if (result !== null) {
        if (this.pageState.strategy) this.pageState.strategy.strategy = this.pageState.selectedStrategy;
        if (this.pageState.formation) this.pageState.formation.formation = this.pageState.selectedFormation;
      }
    }),
    finalize(() => {
      this.pageState.savingStrategy = false;
      this.pageState.savingFormation = false;  // ← apagar ambos
    })
  ).subscribe();
}
  // ─── Restaurar táctica por defecto ────────────────────────────────────────

  public resetToDefault(): void {
    const teamId = this.adminService.getCurrentTeam()?.teamId ?? '';
    if (!teamId) return;

    this.pageState.savingResetDefault = true;

    this.post<{ strategy: string; formation: string }>(
      `/my-team/resetTeamTactics`,
      { teamId }
    )
      .pipe(
        tap((response) => {
          const data = response?.data;
          if (data) {
            this.pageState.selectedStrategy = data.strategy;
            this.pageState.selectedFormation = data.formation;
            if (this.pageState.strategy) this.pageState.strategy.strategy = data.strategy;
            if (this.pageState.formation) this.pageState.formation.formation = data.formation;
          }
          // Recargar datos completos para actualizar ratings y compatibilidad
          this.loadCoaching(teamId).subscribe();
        }),
        catchError(() => {
          this.pageState.errorMessage = 'No se pudo restaurar la táctica. Intente nuevamente.';
          return of(undefined);
        }),
        finalize(() => {
          this.pageState.savingResetDefault = false;
        })
      )
      .subscribe();
  }

  

   private loadCoaching(teamId: string): Observable<void> {
      this.pageState.loading = true;
      this.pageState.errorMessage = '';

      return this.get<CoachingOverviewData>(`/my-team/coach?teamId=${teamId}&lang=${this.pageState.lang}`).pipe(
      map((response) => response?.data),
      tap((data: CoachingOverviewData) => {
        this.pageState.coach = data.coach;
        this.pageState.strategy = data.strategy;
        this.pageState.formation = data.formation;
        this.pageState.stats = data.stats;
        this.pageState.strategies = data.strategies;
        this.pageState.formations = data.formations;
        this.pageState.baseRatings  = data.baseRatings;
        this.pageState.effectiveRatings = data.effectiveRatings;
        this.pageState.ratingDeltas = data.ratingDeltas;
        this.pageState.strategyPenalty = data.strategyPenalty;

        // Inicializar selectores desde los datos del servidor
        this.pageState.selectedStrategy =
              data.compatibility?.selectedStrategy ||
              data.strategy?.strategy ||
             (data.strategies?.[0]?.strategy ?? ''); 

        this.pageState.selectedFormation =
              data.compatibility?.selectedFormation ||
              data.formation?.formation ||
              (data.formations?.[0]?.formation ?? '');
              
        this.pageState.compatibleFormations = data.compatibility?.compatibleFormations ?? [];
        this.pageState.compatibleStrategies = data.compatibility?.compatibleStrategies ?? [];

        this.pageState.selectedStrategyDescription =
              (data.strategies ?? []).find(s => s.strategy === this.pageState.selectedStrategy)?.description ?? '';

        this._recalcCompatibilityStatus();
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.coach = null;
        this.pageState.strategy = null;
        this.pageState.formation = null;
        this.pageState.stats = null;
        this.pageState.strategies = [];
        this.pageState.formations = [];
        this.pageState.baseRatings = [];
        this.pageState.effectiveRatings = [];
        this.pageState.ratingDeltas = [];
        this.pageState.strategyPenalty = 0;
        this.pageState.compatibleFormations = [];
        this.pageState.compatibleStrategies = [];
        this.pageState.errorMessage = 'No se pudo cargar el cuerpo técnico. Intente nuevamente.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private _recalcCompatibilityStatus(): void {
    const strategy  = this.pageState.selectedStrategy;
    const formation = this.pageState.selectedFormation;

    const isOriginalStrategy  = strategy  === (this.pageState.strategy?.strategy  ?? '');
    const isOriginalFormation = formation === (this.pageState.formation?.formation ?? '');

    if (!strategy || !formation) {
      this.pageState.tacticalStatusTone = 'original';
      this.pageState.isSelectedFormationCompatible = false;
      return;
    }

    const compatible = this.pageState.compatibleFormations.includes(formation);
    this.pageState.isSelectedFormationCompatible = compatible;

    if (isOriginalStrategy && isOriginalFormation) {
      this.pageState.tacticalStatusTone = 'original';
    } else {
      this.pageState.tacticalStatusTone = compatible ? 'compatible' : 'incompatible';
    }
  }

  private _recalcRatings(): void {
  const stats = this.pageState.stats;
  const selectedStrat = this.pageState.strategies.find(
    s => s.strategy === this.pageState.selectedStrategy
  );

  if (!stats || !selectedStrat?.strategyLineImpact) return;

  const impact = selectedStrat.strategyLineImpact;
  const isCompatible = this.pageState.isSelectedFormationCompatible;

  // Penalización si la formación no es compatible
  const penalty = isCompatible ? 0 : (this.pageState.strategyPenalty ?? 0);

  const effectiveOverall = Math.round(
  (stats.attack + impact.attack + stats.defense + impact.defense + stats.midfield + impact.midfield) / 3
);

  this.pageState.effectiveRatings = [
    { metric: 'Attack',   value: stats.attack   + impact.attack   - penalty },
    { metric: 'Defense',  value: stats.defense  + impact.defense  - penalty },
    { metric: 'Midfield', value: stats.midfield + impact.midfield - penalty },
    { metric: 'Overall',  value: effectiveOverall - penalty },
  ];

  this.pageState.ratingDeltas = [
  { metric: 'Attack',   strategyDelta: impact.attack,   compatibilityPenalty: penalty, totalDelta: impact.attack   - penalty },
  { metric: 'Defense',  strategyDelta: impact.defense,  compatibilityPenalty: penalty, totalDelta: impact.defense  - penalty },
  { metric: 'Midfield', strategyDelta: impact.midfield, compatibilityPenalty: penalty, totalDelta: impact.midfield - penalty },
  { metric: 'Overall',  strategyDelta: 0, compatibilityPenalty: penalty, totalDelta: -penalty },
];
  }
}
