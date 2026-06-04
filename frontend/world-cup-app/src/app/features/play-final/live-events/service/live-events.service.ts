import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { UiVisualsService } from '../../../../core/services/ui-visuals.service';
import { LiveEventFeedApiItem, LiveEventStyle, LiveEventsApiResponse } from '../model/live-events-api.interface';
import { LiveEventsViewModel } from '../model/live-events-view-model.interface';

@Injectable({ providedIn: 'root' })
export class LiveEventsService extends BaseApiService {
  private readonly uiVisualsService = inject(UiVisualsService);
 
  private readonly pageState: LiveEventsViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showEmptyState: false,
    data: null,
    showNoFinalState: false
  };

  private hasInitialized = false;

  getViewModel(): Observable<LiveEventsViewModel> {
    return of(this.pageState);
  }

  initialize(): void {
    if (this.hasInitialized) {
      this.loadLiveEvents().subscribe();
      return;
    }

    this.hasInitialized = true;
    this.pageState.lang = this.getCurrentLang();

    combineLatest([
      this.appContextService.lang$,
      this.appContextService.worldCupRefresh$,
    ])
      .pipe(
        tap(([lang]) => (this.pageState.lang = lang === 'en' ? 'en' : 'es')),
        switchMap(() => this.loadLiveEvents()),
      )
      .subscribe();
  }

  refresh(): void {
    this.loadLiveEvents().subscribe();
  }

  private loadLiveEvents(): Observable<void> {
    const lang = this.getCurrentLang();
    this.pageState.lang = lang;
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<LiveEventsApiResponse>('/final-match/live-events', { lang }).pipe(
      map((response) => response.data),
      map((data) => this.normalizeResponse(data)),
      tap((data) => (this.pageState.data = data)),
      tap((data) => (this.pageState.showEmptyState = !data)),
      map(() => undefined),
      catchError((error: HttpErrorResponse) => {
        this.pageState.data = null;

        if (this.isFinalUnavailableError(error)) {
          this.pageState.showEmptyState = true;
          this.pageState.errorMessage = '';
          return of(undefined);
        }

        this.pageState.showEmptyState = false;
        this.pageState.errorMessage = 'No se pudieron cargar los eventos de la final.';
        return of(undefined);
      }),
      finalize(() => (this.pageState.loading = false)),
    );
  }

  private normalizeResponse(
    data: LiveEventsApiResponse | null | undefined,
  ): LiveEventsApiResponse | null {
    if (!data) {
      return null;
    }

    return {
      ...data,
      team: {
        ...data.team,
        flag: this.uiVisualsService.getTeamFlag(data.team?.id),
      },
      opponent: {
        ...data.opponent,
        flag: this.uiVisualsService.getTeamFlag(data.opponent?.id),
      },
      events: (data.events ?? []).map((event) => this.decorateEvent(event)),
    };
  }

  private decorateEvent(event: LiveEventFeedApiItem): LiveEventFeedApiItem {
  const eventType = (event.type ?? '').toUpperCase();
  const style = (event.style ?? 'info').toUpperCase();

  if (event.style === 'goal' || eventType.includes('GOAL')) {
    return { ...event, icon: '⚽', style: 'goal' };
  }

  if (event.style === 'yellow' || style.includes('YELLOW')) {
    return { ...event, icon: '🟨', style: 'yellow' };
  }

  if (event.style === 'red' || style.includes('RED')) {
    return { ...event, icon: '🟥', style: 'red' };
  }

  if (eventType.includes('SUB')) {
    return { ...event, icon: '🔄', style: 'sub' };
  }

  return { ...event, icon: 'ℹ️', style: 'info' };
}

  private isFinalUnavailableError(error: HttpErrorResponse): boolean {
    const messageCode = (error?.error as { responseMessage?: { messageCode?: string } } | undefined)
      ?.responseMessage?.messageCode;

    return messageCode === 'WC_FINAL_MATCH_UNAVAILABLE';
  }
}
