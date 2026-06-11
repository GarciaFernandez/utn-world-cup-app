import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LiveEventsService } from './service/live-events.service';
import { LiveEventsViewModel } from './model/live-events-view-model.interface';
import { LiveEventsApiResponse, LiveEventFeedApiItem } from './model/live-events-api.interface';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css'],
})
export class LiveEventsPageComponent implements OnInit {
  private readonly pageService = inject(LiveEventsService);

  pageState$: Observable<LiveEventsViewModel> = this.pageService.getViewModel();

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onRefresh(): void {
    this.pageService.refresh();
  }

  getMatchStateLabel(match: LiveEventsApiResponse): string {
    if (match.isFinished) return 'Finalizada';
    return match.isActive ? 'En vivo' : 'Última final';
  }

  getTeamMeta(match: LiveEventsApiResponse, side: 'team' | 'opponent'): string {
    const team = match[side];
    return `${team.formation ?? 'Sin formación'} · ${team.strategy ?? 'Sin estrategia'}`;
  }

  getEventDescription(event: LiveEventFeedApiItem): string {
    return event.text || event.type || 'Evento del partido';
  }

  getGoalsText(match: LiveEventsApiResponse): string {
    return `${match.team.name}: ${match.summary.teamGoals} · ${match.opponent.name}: ${match.summary.opponentGoals}`;
  }

  getCardsText(match: LiveEventsApiResponse, cardType: 'yellow' | 'red'): string {
    if (cardType === 'yellow') {
      return `${match.team.name}: ${match.summary.teamYellowCards} · ${match.opponent.name}: ${match.summary.opponentYellowCards}`;
    }
    return `${match.team.name}: ${match.summary.teamRedCards} · ${match.opponent.name}: ${match.summary.opponentRedCards}`;
  }

  
  trackByEvent(_index: number, event: LiveEventFeedApiItem): number {
    return event.statId;
  }
}