import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Podium {
  rank: number;
  team: string;
}

interface Match {
  id: string;
  date: string;
  opponent: string;
  result: string;
}

interface WorldCupHistoryItem {
  worldCupId: string;
  title: string;
  date: string;
  podium: Podium[];
  stats: Record<string, number | string>;
  awards: Record<string, unknown>;
}

export interface MatchHistory {

  year: number;

  host: string;

  maxStage: string;

  position: number;

  gamesWon: number;

  gamesDrawn: number;

  gamesLost: number;

  goalsFor: number;

  goalsAgainst: number;

  matches: Match[];
}

export interface WorldCupHistoryResponse {

  success: boolean;
  data: WorldCupHistoryItem[] | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorldCupHistoryService {
 
private apiUrl ='http://localhost:4101/worldCupCore/world-cup/history';
  constructor(private readonly http: HttpClient) {}

  getHistory(): Observable<WorldCupHistoryResponse> {
    return this.http.get<WorldCupHistoryResponse>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error detallado desde el servicio:', error);
        return throwError(() => error);
      })
    );
  }
}
