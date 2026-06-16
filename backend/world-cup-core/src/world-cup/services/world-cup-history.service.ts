
import { Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { WorldCupApiService } from '../../basic/world-cup-api.service';

interface Participant {
  id: string;
  name: string;
}

interface WorldCupDetails {
  status: string;
  title: string;
  finalDate: string;
  participants: Participant[];
}

interface Podium {
  rank: number;
  team: string;
}

interface StatSummary {
  podium: Podium[];
  summary: Record<string, number | string>;
}

export interface WorldCupHistoryItem {
  worldCupId: string;
  title: string;
  date: string;
  podium: Podium[];
  stats: Record<string, number | string>;
  awards: Record<string, unknown>;
}

@Injectable()
export class WorldCupHistoryService extends AbstractBaseService {
  private readonly teamId: string;
  private readonly lang: string;

  constructor(
    adminService: AdminService,
    public readonly worldCupApiService: WorldCupApiService
  ) {
    super(adminService);
    this.teamId = this.adminService.getCurrentTeamId();
    this.lang = this.adminService.getCurrentLang();
  }

  async getHistory() {
    try {
      const allWorldCupIds =
        await this.worldCupApiService.get<string[]>('/world-cup/history');

      if (!Array.isArray(allWorldCupIds)) {
        return {
          success: false,
          data: null,
          message: 'IDs inválidos'
        };
      }

      const historyForTunisia: WorldCupHistoryItem[] = [];

      for (const id of allWorldCupIds) {
        const details =
          await this.worldCupApiService.get<WorldCupDetails>(
            `/world-cup/${id}`
          );

        if (!details) continue;
        if (details.status !== 'ENDED') continue;

        const isParticipating = details.participants?.some(
          (p) => p.id === this.teamId
        );

        if (!isParticipating) continue;

        const stats =
          await this.worldCupApiService.get<StatSummary>(
            `/world-cup/${id}/stats`
          );

        const awards =
          await this.worldCupApiService.get<Record<string, unknown>>(
            `/world-cup/${id}/awards?lang=${this.lang}`
          );

        historyForTunisia.push({
          worldCupId: id,
          title: details.title,
          date: details.finalDate,
          podium: stats?.podium ?? [],
          stats: stats?.summary ?? {},
          awards: awards ?? {}
        });
      }

      return {
        success: true,
        data: historyForTunisia.length ? historyForTunisia : [],
        message:
          historyForTunisia.length === 0
            ? 'Historial vacío'
            : 'OK'
      };
    } catch (error) {
      console.error('Error en getHistory:', error);

      return {
        success: false,
        data: null,
        message: 'Error al obtener el historial'
      };
    }
  }
}