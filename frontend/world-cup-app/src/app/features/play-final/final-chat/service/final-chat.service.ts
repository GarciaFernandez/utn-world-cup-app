import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from '../../../../shared/admin/service/admin.service';
import { FinalChatViewModel } from '../model/final-chat-view-model.interface';
import { FinalChatApiResponse, FinalChatMessageApiItem } from '../model/final-chat-api.interface';

@Injectable({ providedIn: 'root' })
export class FinalChatService extends BaseApiService {
  private readonly adminService = inject(AdminService);

  public chatTimeline: FinalChatMessageApiItem[] = [];

  private readonly pageState: FinalChatViewModel = {
    lang: 'es',
    loading: false,
    starting: false,
    sending: false,
    errorMessage: '',
    actionErrorMessage: '',
    showNoFinalState: false,
    data: null,
    teamsPreview: null,
  };

  private hasInitialized = false;

  public getViewModel(): FinalChatViewModel {
    return this.pageState;
  }

  /**
   * Resetea por completo las variables de control.
   * Se invoca únicamente cuando el usuario abandona voluntariamente el partido
   * presionando el botón "Salir al Menú" desde el componente.
   */
  public resetearEstado(): void {
    this.hasInitialized = false;
    this.chatTimeline = [];
    this.pageState.data = null;
    this.pageState.errorMessage = '';
    this.pageState.actionErrorMessage = '';
    this.pageState.showNoFinalState = false;
  }

  /**
   * Inicializa las configuraciones básicas de idioma para la página,
   * pero ya no gatilla de forma automática el partido de la final.
   */
  public initialize(): void {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();

    this.appContextService.lang$.pipe(
      tap((lang) => (this.pageState.lang = lang === 'en' ? 'en' : 'es'))
    ).subscribe();
  }

  /**
   * Inicia o reanuda el partido de la final a demanda del usuario,
   * respondiendo de forma manual al click de la interfaz.
   */
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
          // MODIFICACIÓN SEGURA: Solo inicializamos el historial si está en 0 (arranque limpio).
          // Si el usuario ya venía jugando y cambió de pestaña, el length va a ser mayor a 0,
          // ignorando este bloque y protegiendo el feed para que no sufra recortes ni duplicados.
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
          // CONTROL DE TIPADO: Si ya existe el objeto base en memoria, usamos Object.assign de forma segura
          if (this.pageState.data) {
            Object.assign(this.pageState.data, data);
          } else {
            // Si por algún motivo era null, le asignamos la data directamente para inicializarlo
            this.pageState.data = data;
          }
          
          if (data.messageItems && data.messageItems.length > 0) {
            // Sumamos los mensajes de a uno con un forEach clásico
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
}