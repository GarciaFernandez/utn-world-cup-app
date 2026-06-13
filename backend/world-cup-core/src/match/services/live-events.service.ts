import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { AdminService } from '../../admin/admin.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';

interface MatchCurrentStatsTeam {
  id: string;
  name: string;
  strategy: string;
  formation: string;
  coachName: string;
  coachProfile: string;
}

interface MatchCurrentStatsSummary {
  teamGoals: number;
  opponentGoals: number;
  teamYellowCards: number;
  teamRedCards: number;
  opponentYellowCards: number;
  opponentRedCards: number;
}

interface MatchCurrentStatsEvent {
  statId: number;
  minute: number;
  turn: number;
  eventType: string;
  zone: string;
  action: string;
  teamId: string;
  teamName: string;
  playerName: string;
  playerPosition: string;
  cardType: string | null;
  isGoal: boolean;
  message: string;
  creationDate: string;
}

interface MatchCurrentStatsResponse {
  matchId: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  score: string;
  team: MatchCurrentStatsTeam;
  opponent: MatchCurrentStatsTeam;
  summary: MatchCurrentStatsSummary;
  events: MatchCurrentStatsEvent[];
}

interface LiveEventsTeamApiItem {
  id: string;
  name: string;
  flag: string;
  strategy: string;
  strategyLabel: string;
  formation: string;
  coachName: string;
  coachProfile: string;
}

interface LiveEventsSummaryApiItem {
  teamGoals: number;
  opponentGoals: number;
  teamYellowCards: number;
  teamRedCards: number;
  opponentYellowCards: number;
  opponentRedCards: number;
  totalGoals: number;
}

interface LiveEventFeedApiItem {
  statId: number;
  minute: number;
  minuteLabel: string;
  turn: number;
  type: string;
  style: 'goal' | 'yellow' | 'red' | 'sub' | 'info';
  icon: string;
  text: string;
  teamId: string | null;
  teamName: string | null;
  playerName: string | null;
}

interface LiveEventsApiResponse {
  teamId: string;
  lang: string;
  matchId: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  zone: string | null;
  zoneLabel: string;
  score: string;
  team: LiveEventsTeamApiItem;
  opponent: LiveEventsTeamApiItem;
  summary: LiveEventsSummaryApiItem;
  playerOfMatch: null;
  events: LiveEventFeedApiItem[];
}

interface LiveEventsResponse {
  success: boolean;
  serverTime: string;
  responseMessage: string;
  data: LiveEventsApiResponse;
}

@Injectable()
export class LiveEventsService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  async getLiveEvents(lang?: string): Promise<LiveEventsResponse> {
    try {
      const activeLang = lang || this.getCurrentLang();
      const raw = await this.worldCupFeatureApiService.getMatchCurrentStats(activeLang) as unknown as MatchCurrentStatsResponse;

      const events: LiveEventFeedApiItem[] = (raw.events ?? []).map(
        (event: MatchCurrentStatsEvent) => {
          const typeStr = event.eventType ?? 'INFO';
          let style: 'goal' | 'yellow' | 'red' | 'sub' | 'info' = 'info';
          let icon = 'ℹ️';

          if (event.isGoal) {
            style = 'goal';
            icon = '⚽';
          } else if (event.cardType === 'YELLOW') {
            style = 'yellow';
            icon = '🟨';
          } else if (event.cardType === 'RED') {
            style = 'red';
            icon = '🟥';
          } else if (typeStr.includes('SUB')) {
            style = 'sub';
            icon = '🔄';
          } else if (typeStr.includes('FOUL')) {
            icon = '🦵';
          } else if (
            typeStr.includes('ATTACK') ||
            typeStr.includes('CORNER') ||
            typeStr.includes('CROSS') ||
            typeStr.includes('KICKOFF')
          ) {
            icon = '⚡';
          }

          return {
            statId: event.statId ?? 0,
            minute: event.minute ?? 0,
            minuteLabel: `${event.minute ?? 0}'`,
            turn: event.turn ?? 0,
            type: typeStr,
            style,
            icon,
            text: this.replaceMessageTokens(event.message ?? '', event),
            teamId: event.teamId ?? null,
            teamName: event.teamName ?? null,
            playerName: event.playerName ?? null,
          };
        },
      );

      return {
        success: true,
        serverTime: new Date().toISOString(),
        responseMessage: '',
        data: {
          teamId: raw.team?.id ?? '',
          lang: activeLang,
          matchId: raw.matchId ?? '',
          isActive: raw.isActive ?? false,
          isFinished: raw.isFinished ?? false,
          minute: raw.minute ?? 0,
          turn: raw.turn ?? 0,
          zone: null,
          zoneLabel: '-',
          score: raw.score ?? '0-0',
          team: {
            id: raw.team?.id ?? '',
            name: raw.team?.name ?? '',
            flag: this.getFlag(raw.team?.id),
            strategy: raw.team?.strategy ?? '',
            strategyLabel: raw.team?.strategy ?? '',
            formation: raw.team?.formation ?? '',
            coachName: raw.team?.coachName ?? '',
            coachProfile: raw.team?.coachProfile ?? '',
          },
          opponent: {
            id: raw.opponent?.id ?? '',
            name: raw.opponent?.name ?? '',
            flag: this.getFlag(raw.opponent?.id),
            strategy: raw.opponent?.strategy ?? '',
            strategyLabel: raw.opponent?.strategy ?? '',
            formation: raw.opponent?.formation ?? '',
            coachName: raw.opponent?.coachName ?? '',
            coachProfile: raw.opponent?.coachProfile ?? '',
          },
          summary: {
            teamGoals: raw.summary?.teamGoals ?? 0,
            opponentGoals: raw.summary?.opponentGoals ?? 0,
            teamYellowCards: raw.summary?.teamYellowCards ?? 0,
            opponentYellowCards: raw.summary?.opponentYellowCards ?? 0,
            teamRedCards: raw.summary?.teamRedCards ?? 0,
            opponentRedCards: raw.summary?.opponentRedCards ?? 0,
            totalGoals: (raw.summary?.teamGoals ?? 0) + (raw.summary?.opponentGoals ?? 0),
          },
          playerOfMatch: null,
          events,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'No se pudieron cargar los eventos de la final.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private replaceMessageTokens(
    message: string,
    event: MatchCurrentStatsEvent,
  ): string {
    return message
      .replaceAll('{teamName}', event.teamName ?? '')
      .replaceAll('{team.id}', event.teamId ?? '')
      .replaceAll('{playerName}', event.playerName ?? '')
      .replaceAll('{minute}', String(event.minute ?? ''));
  }

  private getFlag(id?: string | null): string {
    const teamFlags: Record<string, string> = {
      alg: '🇩🇿', arg: '🇦🇷', aus: '🇦🇺', bel: '🇧🇪', bra: '🇧🇷',
      can: '🇨🇦', col: '🇨🇴', cro: '🇭🇷', ecu: '🇪🇨', egy: '🇪🇬',
      eng: '🇬🇧', esp: '🇪🇸', fra: '🇫🇷', ger: '🇩🇪', gha: '🇬🇭',
      irn: '🇮🇷', irq: '🇮🇶', jpn: '🇯🇵', kor: '🇰🇷', mar: '🇲🇦',
      mex: '🇲🇽', ned: '🇳🇱', nor: '🇳🇴', pan: '🇵🇦', par: '🇵🇾',
      por: '🇵🇹', qat: '🇶🇦', sau: '🇸🇦', sco: '🏴', sen: '🇸🇳',
      sui: '🇨🇭', swe: '🇸🇪', tun: '🇹🇳', tur: '🇹🇷', uru: '🇺🇾',
      usa: '🇺🇸', uzb: '🇺🇿',
    };
    return teamFlags[(id ?? '').toLowerCase()] ?? '⚽';
  }
}