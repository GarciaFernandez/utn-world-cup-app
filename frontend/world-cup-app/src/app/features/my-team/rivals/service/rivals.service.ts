import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from '../../../../shared/admin/service/admin.service';
import { RivalsViewModel } from '../model/rivals-view-model.interface';
@Injectable({ providedIn: 'root' })
export class RivalsService extends BaseApiService {
  private readonly adminService = inject(AdminService);

  // Estado interno de la pantalla. Estructura reactiva que lee el HTML
  private readonly pageState: RivalsViewModel = {
    rivals: [],
    totalRivals: 0,
    loading: false,
    errorMessage: '',
    lang: 'es',
    selectedTeamLabel: 'ARG',
  };

  // Flag para evitar registrar múltiples suscripciones a los observables globales
  private hasInitialized = false;

  // Expone el estado de forma directa para el getter del componente
  public getViewModel(): RivalsViewModel {
    return this.pageState;
  }

  // Orquestador del flujo reactivo: escucha cambios globales y gatilla la API
  public initialize(): void {
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
        tap(([, lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(() => this.loadRivals()) // Muta el evento global en la llamada al backend
      )
      .subscribe();
  }

  // Petición HTTP directa al endpoint de rivales
  private loadRivals(): Observable<void> {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<RivalsViewModel['rivals']>('/my-team/rivals').pipe(
      // Desempaqueta la envoltura estándar del BaseApiService
      map((response) => response?.data),
      // Inyecta la data limpia directo en el array del estado de la pantalla
      tap((data) => {
        this.pageState.rivals = data ?? [];
        this.pageState.totalRivals = data?.length ?? 0;
      }),
      // Limpia el retorno del flujo para que coincida con el Observable<void>
      map(() => undefined),
      // Ataja fallos de red: limpia la grilla y setea el mensaje para el HTML
      catchError(() => {
        this.pageState.rivals = [];
        this.pageState.totalRivals = 0;
        this.pageState.errorMessage = 'No se pudo cargar la lista de rivales históricos. Intente nuevamente.';
        return of(undefined);
      }),
      // Apaga el spinner de carga tanto si la petición salió bien como si falló
      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }
}