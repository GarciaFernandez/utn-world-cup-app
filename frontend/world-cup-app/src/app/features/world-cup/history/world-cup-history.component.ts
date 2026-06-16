import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
}

interface ApiResponse {
  success: boolean;
  data: WorldCupHistoryItem[] | null;
  message: string;
}

@Component({
  selector: 'app-world-cup-history-page',
  templateUrl: './world-cup-history.component.html',
  styleUrls: ['./world-cup-history.component.css']
})
export class WorldCupHistoryPageComponent implements OnInit {
  historyData: WorldCupHistoryItem[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http
      .get<ApiResponse>('http://localhost:3101/worldCupCore/world-cup/history')
      .subscribe({
        next: (res) => {
          this.historyData = res.data ?? [];
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.message || 'Error al cargar datos';
          this.loading = false;
        }
      });
  }

  
  getSortedPodium(podium: Podium[]): Podium[] {
    if (!podium) return [];
    return [...podium].sort((a, b) => a.rank - b.rank);
  }

  getStatKeys(stats: Record<string, number | string>): string[] {
    return Object.keys(stats || {});
  }

  formatStatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').toUpperCase();
  }

  getAwardEntries(awards: Record<string, unknown>): { key: string, value: unknown }[] {
    if (!awards) return [];
    return Object.entries(awards).map(([key, value]) => ({ key, value }));
  }
}