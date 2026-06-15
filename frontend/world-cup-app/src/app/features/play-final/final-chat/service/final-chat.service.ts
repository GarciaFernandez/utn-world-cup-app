import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from '../../../../shared/admin/service/admin.service';
import { FinalChatViewModel } from '../model/final-chat-view-model.interface';
import { FinalChatApiResponse, FinalChatMessageApiItem,MatchStrategyApiItem,MatchFormationApiItem,SelectMatchStrategyApiResponse,SelectMatchFormationApiResponse } from '../model/final-chat-api.interface';

@Injectable({ providedIn: 'root' })
export class FinalChatService extends BaseApiService {
  private readonly adminService = inject(AdminService);

  public chatTimeline: FinalChatMessageApiItem[] = [];

  private readonly pageState: FinalChatViewModel = {
    lang: 'es',
    loading: false,
    starting: false,
    sending: false,
    changingTactic: false,
    errorMessage: '',
    actionErrorMessage: '',
    showNoFinalState: false,
    data: null,
    teamsPreview: null,
    availableStrategies: [], 
    availableFormations: []  ,
    draftMessage: ''
  };

  private hasInitialized = false;

  public getViewModel(): FinalChatViewModel {
    return this.pageState;
  }


  public resetearEstado(): void {
    this.hasInitialized = false;
    this.chatTimeline = [];
    this.pageState.data = null;
    this.pageState.errorMessage = '';
    this.pageState.actionErrorMessage = '';
    this.pageState.showNoFinalState = false;
    this.pageState.availableStrategies = []; 
    this.pageState.availableFormations = []; 
  }

 
  public initialize(): void {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();

    this.appContextService.lang$.pipe(
      tap((lang) => (this.pageState.lang = lang === 'en' ? 'en' : 'es'))
    ).subscribe();
  }


  public comenzarPartido(): Observable<void> {
    return this.appContextService.currentTeamId$.pipe(
      switchMap((teamId) => this.startFinal(teamId))
    );
  }

  private startFinal(teamId: string): Observable<void> {
    this.pageState.starting = true;
    this.pageState.errorMessage = '';

    const payload = { 
      teamId: teamId.trim().toLowerCase(), 
      lang: this.pageState.lang 
    };

    return this.post<FinalChatApiResponse>('/play-final/start-final', payload).pipe(
      map((response) => response?.data),
      tap((data) => {
        this.pageState.data = data ?? null;
        this.pageState.showNoFinalState = !data;
        
        if (data && data.messageItems) {  

          if (this.chatTimeline.length === 0) {
            this.chatTimeline = data.messageItems;
          }
        }
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.data = null;
        this.pageState.showNoFinalState = true;
        this.pageState.errorMessage = 'No se pudo iniciar el partido de la final.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.starting = false;
      })
    );
  }

public playTurn(selectedOption: number): Observable<void> {
    this.pageState.sending = true;
    this.pageState.actionErrorMessage = '';

    const payload = {
      selectedOption: String(selectedOption),
      lang: this.pageState.lang
    };

    return this.post<FinalChatApiResponse>('/play-final/play', payload).pipe(
      map((response) => response?.data),
      tap((data) => {
        if (data) {

          if (this.pageState.data) {
            Object.assign(this.pageState.data, data);
          } else {

            this.pageState.data = data;
          }
          
          if (data.messageItems && data.messageItems.length > 0) {

            data.messageItems.forEach(item => {
              this.chatTimeline.push(item);
            });
          }
        }
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.actionErrorMessage = 'Error al procesar el turno de juego táctico. Intente de nuevo.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.sending = false;
      })
    );
  }
public cargarEstrategiasDisponibles(): Observable<void> {
    return this.get<MatchStrategyApiItem[]>('/play-final/strategies').pipe(
      map((response) => response?.data || []),
      tap((strategies) => {
        this.pageState.availableStrategies = strategies;
      }),
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }


  public cargarFormacionesDisponibles(): Observable<void> {
    return this.get<MatchFormationApiItem[]>('/play-final/formations').pipe(
      map((response) => response?.data || []),
      tap((formations) => {
        this.pageState.availableFormations = formations;
      }),
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }


  public cambiarEstrategiaPartido(strategy: string): Observable<void> {
    this.pageState.changingTactic = true;
    this.pageState.actionErrorMessage = '';
    
    const payload = { strategy, lang: this.pageState.lang };

    return this.post<SelectMatchStrategyApiResponse>('/play-final/select-strategy', payload).pipe(
      map((response) => response?.data),
      tap((data) => {
        if (data && this.pageState.data) {

          const coach = this.pageState.data.teamCoachName || 'El director técnico';
          const minutoActual = this.pageState.data.minute ?? 0;
          const turnoActual = this.pageState.data.turn ?? 0;
          this.pageState.data.teamStrategy = data.strategy;
          
          this.chatTimeline.push({
            type: 'INFO',
            text: `[Cambios] - ${coach} modificó la estrategia del equipo del tipo ${data.strategy}.`,
            minute: minutoActual,
            turn: turnoActual,
            teamId: this.pageState.data.teamId || null,
            teamName: this.pageState.data.teamName || null,
            playerName: null,
            bubbleRole: 'system', 
            icon: 'pi pi-sitemap'   
          });
        }
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.actionErrorMessage = 'No se pudo actualizar la estrategia del equipo.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.changingTactic = false;
      })
    );
  }
    
   public setDraftMessage(value: string): void {
    this.pageState.draftMessage = value;
  }
  public cambiarFormacionPartido(formation: string): Observable<void> {
    this.pageState.changingTactic = true;
    this.pageState.actionErrorMessage = '';

    const payload = { formation, lang: this.pageState.lang };

    return this.post<SelectMatchFormationApiResponse>('/play-final/select-formation', payload).pipe(
      map((response) => response?.data),
      tap((data) => {
        if (data && this.pageState.data) {
          const coach = this.pageState.data.teamCoachName;
          const minutoActual = this.pageState.data.minute ?? 0;
          const turnoActual = this.pageState.data.turn ?? 0;
          this.pageState.data.teamFormation = data.formation;
          this.chatTimeline.push({
          type: 'INFO',
          text: `[Cambios] - ${coach} modificó el esquema del equipo a un ${data.formation}.`,
          minute: minutoActual,
          turn: turnoActual,
          teamId: this.pageState.data.teamId || null,
          teamName: this.pageState.data.teamName || null,
          playerName: null,
          bubbleRole: 'system', 
          icon: 'pi pi-sitemap'   
          });
        }
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.actionErrorMessage = 'No se pudo actualizar la formación del equipo.';
        return of(undefined);
      }),
      finalize(() => {
        this.pageState.changingTactic = false;
      })
    );
  }
}