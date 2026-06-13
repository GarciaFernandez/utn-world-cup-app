import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, finalize, map, of, switchMap, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { UiVisualsService } from '../../../../core/services/ui-visuals.service';
import { ResponseObject } from '../../../../core/models/response-object.interface';

import { LiveEventFeedApiItem, LiveEventsApiResponse } from '../model/live-events-api.interface';
import { LiveEventsViewModel } from '../model/live-events-view-model.interface';

interface BackendErrorBody {
  responseMessage?: {
    messageCode?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LiveEventsService extends BaseApiService {
  private readonly uiVisualsService = inject(UiVisualsService);

  private readonly pageState: LiveEventsViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showEmptyState: false,
    showNoFinalState: false,
    data: null,
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
      map((response: ResponseObject<LiveEventsApiResponse>) => this.normalizeResponse(response.data)),
      tap((data) => (this.pageState.data = data)),
      tap((data) => (this.pageState.showEmptyState = !data)),
      map(() => undefined as void),
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
    if (!data) return null;

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
    const upperType  = (event.type  ?? '').toUpperCase();
    const upperStyle = (event.style ?? '').toUpperCase();

    if (upperStyle === 'GOAL'   || upperType.includes('GOAL'))   {
      return { ...event, icon: '⚽', style: 'goal' };
    }
    if (upperStyle === 'YELLOW' || upperType.includes('YELLOW')) {
      return { ...event, icon: '🟨', style: 'yellow' };
    }
    if (upperStyle === 'RED'    || upperType.includes('RED'))    {
      return { ...event, icon: '🟥', style: 'red' };
    }
    if (upperType.includes('SUB')) {
      return { ...event, icon: '🔄', style: 'sub' };
    }

    return { ...event, icon: 'ℹ️', style: 'info' };
  }

  private isFinalUnavailableError(error: HttpErrorResponse): boolean {
    if (!error?.error || typeof error.error !== 'object') return false;

    const body = error.error as BackendErrorBody;

    if (!body.responseMessage || typeof body.responseMessage !== 'object') return false;

    return body.responseMessage.messageCode === 'WC_FINAL_MATCH_UNAVAILABLE';
  }
}