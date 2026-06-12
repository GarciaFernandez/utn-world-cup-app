import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  opponent: string;
  result: string;
  outcome: string;
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

  responseMessage: {
    messageCode: string;
    message: string;
  };

  data: {

    teamId: string;

    name: string;

    fifaCode: string;

    appearances: number;

    bestResult: string;

    topScorer: {
      name: string;
      goals: number;
    };

    totalStats: {
      matchesPlayed: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
    };

    history: MatchHistory[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorldCupHistoryService {

  private apiUrl =
    'http://localhost:4101/worldCupCore/world-cup/historial';

  constructor(private http: HttpClient) {}

  getHistory(): Observable<WorldCupHistoryResponse> {

    return this.http.get<WorldCupHistoryResponse>(
      this.apiUrl
    );

  }
}
