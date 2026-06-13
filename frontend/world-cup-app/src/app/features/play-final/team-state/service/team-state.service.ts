import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from '../../../../shared/admin/service/admin.service';
import { SimulationApiResponse } from '../../../world-cup/simulate/model/simulate-api.interface';
import { TeamStateApiResponse } from '../model/team-state-api.interface';
import { TeamStateViewModel } from '../model/team-state-view-model.interface';

@Injectable({ providedIn: 'root' })
export class TeamStateService extends BaseApiService {
    private readonly adminService = inject(AdminService);


    private readonly pageState: TeamStateViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoFinalState: false,
    data: null,    
    };

    private hasInitialized = false;


    getViewModel(): TeamStateViewModel {
    return this.pageState;
    }

    initialize(): void {
    if (this.hasInitialized) {
    this.loadTeamState().subscribe();
    return;
    }

    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();

    combineLatest([
    this.appContextService.currentTeamId$,
    this.appContextService.lang$,
    this.appContextService.worldCupRefresh$,
    this.appContextService.finalMatchRefresh$,
    ])
    .pipe(
        tap(([, lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(() => this.loadTeamState()),
    )
    .subscribe();
    }


    refresh(): void {
    this.loadTeamState().subscribe();
    }


    private loadTeamState(): Observable<void> {
    const lang = this.getCurrentLang();
    this.pageState.lang = lang;
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

        return this.get<SimulationApiResponse>('/world-cup/current', { lang }).pipe(
    map((response) => response?.data),
    switchMap((simulation) => {
        const finalMatchId = simulation?.finalMatchId?.trim();

        if (!finalMatchId) {
        this.pageState.data = null;
        this.pageState.showNoFinalState = true;
        return of(undefined);
        }

        return this.get<TeamStateApiResponse>('/final-match/team-state', {
        matchId: finalMatchId,
        lang,
        }).pipe(
        map((teamStateResponse) => teamStateResponse?.data),
        tap((data) => {
            this.pageState.data = data ?? null;
            this.pageState.showNoFinalState = false;
        }),
        map(() => undefined),
        catchError(() => {
            this.pageState.data = null;
            this.pageState.showNoFinalState = true;
            this.pageState.errorMessage = 'No se pudo cargar el estado del equipo. Intenta nuevamente.';
            return of(undefined);
        }),
        );
    }),
    catchError(() => {
        this.pageState.data = null;
        this.pageState.showNoFinalState = true;
        this.pageState.errorMessage = 'No se pudo cargar la final actual. Intenta nuevamente.';
        return of(undefined);
    }),
    finalize(() => (this.pageState.loading = false)),
    );
    }
}