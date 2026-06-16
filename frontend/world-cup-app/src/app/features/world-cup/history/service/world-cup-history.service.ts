import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

<<<<<<< Updated upstream

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
=======
// Mantenemos tus interfaces intactas
interface Podium {
  rank: number;
  team: string;
}

interface WorldCupHistoryItem {
  worldCupId: string;
  title: string;
  date: string;
  podium: Podium[];
  stats: Record<string, number | string>;
  awards: Record<string, unknown>;
>>>>>>> Stashed changes
}


 
export interface WorldCupHistoryResponse {
  success: boolean;
<<<<<<< Updated upstream
  responseMessage: {
    messageCode: string;
    message: string;
  };
  data: {
    teamId: string;
    name: string;
    topScorer: string;
    appearances: number;
    history: MatchHistory[];
  };
=======
  data: WorldCupHistoryItem[] | null;
  message: string;
>>>>>>> Stashed changes
}

@Injectable({
  providedIn: 'root'
})
export class WorldCupHistoryService {
<<<<<<< Updated upstream
  
  private apiUrl = 'http://localhost:4101/worldCupCore/world-cup/historial';

  constructor(private http: HttpClient) {}
=======
 
private apiUrl ='http://localhost:4101/worldCupCore/world-cup/history';
  constructor(private readonly http: HttpClient) {}
>>>>>>> Stashed changes

  
  getHistory(): Observable<WorldCupHistoryResponse> {
<<<<<<< Updated upstream
    return this.http.get<WorldCupHistoryResponse>(this.apiUrl);
=======
    return this.http.get<WorldCupHistoryResponse>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error detallado desde el servicio:', error);
        return throwError(() => error);
      })
    );
>>>>>>> Stashed changes
  }
}