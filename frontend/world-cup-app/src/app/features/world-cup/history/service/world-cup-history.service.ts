import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    topScorer: string;
    appearances: number;
    history: MatchHistory[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorldCupHistoryService {
  
  private apiUrl = 'http://localhost:4101/worldCupCore/world-cup/historial';

  constructor(private http: HttpClient) {}

  
  getHistory(): Observable<WorldCupHistoryResponse> {
    return this.http.get<WorldCupHistoryResponse>(this.apiUrl);
  }
}