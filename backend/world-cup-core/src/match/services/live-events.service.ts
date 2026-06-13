import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { AdminService } from '../../admin/admin.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';

@Injectable()
export class LiveEventsService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  async getLiveEvents(lang?: string): Promise<unknown> {
    try {
      const activeLang = lang || this.getCurrentLang();
      const response = await this.worldCupFeatureApiService.getMatchCurrentStats(activeLang);
      const raw = (response as any).getData ? (response as any).getData() : (response as any).data || response;
      console.log('PRIMER EVENTO RAW:', JSON.stringify(raw.events?.[0]));
      const events = (raw.events ?? []).map((e: any) => {
        let type = e.eventType ?? 'INFO';
        let style = 'info';
        let icon = 'ℹ️';
        if (e.isGoal) { style = 'goal'; icon = '⚽'; type = 'GOAL'; }
        else if (e.cardType === 'YELLOW') { style = 'yellow'; icon = '🟨'; type = 'YELLOW_CARD'; }
        else if (e.cardType === 'RED') { style = 'red'; icon = '🟥'; type = 'RED_CARD'; }
        else if (type.includes('SUB')) { style = 'sub'; icon = '🔄'; }
        else if (type.includes('FOUL')) { style = 'info'; icon = '🦵'; }
        else if (type.includes('ATTACK') || type.includes('CORNER') || type.includes('CROSS')) { style = 'info'; icon = '⚡'; }
        return { statId: e.statId, minute: e.minute, minuteLabel: e.minute + "'", turn: e.turn, type, style, icon, text: e.message ?? '', teamId: e.teamId ?? null, teamName: e.teamName ?? null, playerName: e.playerName ?? null };
      });
      const data = { ...raw, events };
      return { success: true, serverTime: new Date().toISOString(), responseMessage: '', data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('No se pudieron cargar los eventos de la final.', HttpStatus.BAD_GATEWAY);
    }
  }
}
