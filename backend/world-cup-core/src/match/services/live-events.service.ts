import { Injectable } from '@nestjs/common';

interface LiveEventsTeamApiItem {
  id: string;
  name: string;
  flag: string;
  formation: string;
  strategy: string;
  strategyLabel: string;
  coachName: string;
  coachProfile: string;
}

interface LiveEventsSummaryApiItem {
  teamGoals: number;
  opponentGoals: number;
  teamYellowCards: number;
  opponentYellowCards: number;
  teamRedCards: number;
  opponentRedCards: number;
  totalGoals: number;
}

interface LiveEventsPlayerOfMatchApiItem {
  playerName: string;
  teamId: string;
  teamName: string;
  teamFlag: string;
  position: string | null;
}

interface LiveEventFeedApiItem {
  statId: number;
  minute: number;
  minuteLabel: string;
  turn: number;
  type: string;
  style: 'goal' | 'yellow' | 'red' | 'sub' | 'info' | 'foul' | 'attack';
  icon: string;
  text: string;
  teamId: string | null;
  teamName: string | null;
  playerName: string | null;
}

interface LiveEventsApiResponse {
  teamId: string;
  lang: 'es' | 'en';
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
  playerOfMatch: LiveEventsPlayerOfMatchApiItem | null;
  events: LiveEventFeedApiItem[];
}

interface ResponseWrapper<T> {
  success: boolean;
  serverTime: string;
  responseMessage: string;
  data: T;
}

@Injectable()
export class LiveEventsService {

  async getLiveEvents(lang: 'es' | 'en'): Promise<ResponseWrapper<LiveEventsApiResponse>> {

    const mockMatch: LiveEventsApiResponse = {
      teamId: 'TUN',
      lang,
      matchId: 'final-2026',
      isActive: true,
      isFinished: false,
      minute: 58,
      turn: 2,
      zone: 'MID',
      zoneLabel: 'Zona media',
      score: '1 - 0',
      team: {
        id: 'TUN',
        name: lang === 'en' ? 'Tunisia' : 'Túnez',
        flag: '🇹🇳',
        formation: '4-3-3',
        strategy: lang === 'en' ? 'Medium Press' : 'Presión Media',
        strategyLabel: lang === 'en' ? 'Medium Press and Low Block' : 'Presión Media y Bloque Bajo',
        coachName: 'Jalel Kadri',
        coachProfile: '',
      },
      opponent: {
        id: 'FRA',
        name: lang === 'en' ? 'France' : 'Francia',
        flag: '🇫🇷',
        formation: '4-2-3-1',
        strategy: lang === 'en' ? 'Wing Attack' : 'Ataque por las Bandas',
        strategyLabel: lang === 'en' ? 'Wing Attack' : 'Ataque por las Bandas',
        coachName: 'Didier Deschamps',
        coachProfile: '',
      },
      summary: {
        teamGoals: 1,
        opponentGoals: 0,
        teamYellowCards: 2,
        opponentYellowCards: 1,
        teamRedCards: 0,
        opponentRedCards: 0,
        totalGoals: 1,
      },
      playerOfMatch: null,
      events: [
        {
          statId: 101,
          minute: 58,
          minuteLabel: "58'",
          turn: 2,
          type: 'GOAL',
          style: 'goal',
          icon: '⚽',
          text: lang === 'en' ? 'Great goal by Tunisia!' : '¡Golazo de Túnez!',
          teamId: 'TUN',
          teamName: lang === 'en' ? 'Tunisia' : 'Túnez',
          playerName: null,
        },
        {
          statId: 102,
          minute: 30,
          minuteLabel: "30'",
          turn: 1,
          type: 'YELLOW_CARD',
          style: 'yellow',
          icon: '🟨',
          text: lang === 'en' ? 'Yellow card for tactical foul.' : 'Tarjeta amarilla por falta táctica.',
          teamId: 'TUN',
          teamName: lang === 'en' ? 'Tunisia' : 'Túnez',
          playerName: null,
        },
        {
          statId: 103,
          minute: 1,
          minuteLabel: "1'",
          turn: 1,
          type: 'START',
          style: 'info',
          icon: 'ℹ️',
          text: lang === 'en' ? 'Match kicked off!' : '¡Arrancó el partido!',
          teamId: null,
          teamName: null,
          playerName: null,
        },
      ],
    };

    return {
      success: true,
      serverTime: new Date().toISOString(),
      responseMessage: '',
      data: mockMatch,
    };
  }
}