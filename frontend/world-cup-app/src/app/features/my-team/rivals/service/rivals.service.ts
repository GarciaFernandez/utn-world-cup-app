import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { AdminService } from '../../../../shared/admin/service/admin.service';
import { RivalsViewModel } from '../model/rivals-view-model.interface';
@Injectable({ providedIn: 'root' })
export class RivalsService extends BaseApiService {
  private readonly adminService = inject(AdminService);

  
  private readonly pageState: RivalsViewModel = {
    rivals: [],
    totalRivals: 0,
    loading: false,
    errorMessage: '',
    lang: 'es',
    selectedTeamLabel: 'ARG',
  };
 
  private hasInitialized = false;

  public getViewModel(): RivalsViewModel {
    return this.pageState;
  }

  public initialize(): void {
    if (this.hasInitialized) return;


    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();
    this.pageState.selectedTeamLabel = this.adminService.getCurrentTeam()?.name ?? 'ARG';

    this.adminService.currentTeam$.subscribe((team) => {
      this.pageState.selectedTeamLabel = team?.name ?? 'ARG';
    });

    combineLatest([this.appContextService.currentTeamId$, this.appContextService.lang$])
      .pipe(
        tap(([, lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(() => this.loadRivals())
      )
      .subscribe();
  }

  private loadRivals(): Observable<void> {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<RivalsViewModel['rivals']>('/my-team/rivals').pipe(

      map((response) => response?.data),

      tap((data) => {
        this.pageState.rivals = data ?? [];
        this.pageState.totalRivals = data?.length ?? 0;
      }),

      map(() => undefined),

      catchError(() => {
        this.pageState.rivals = [];
        this.pageState.totalRivals = 0;
        this.pageState.errorMessage = 'No se pudo cargar la lista de rivales históricos. Intente nuevamente.';
        return of(undefined);
      }),

      finalize(() => {
        this.pageState.loading = false;
      })
    );
  }
}