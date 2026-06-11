import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';


interface RawJourneyMatch {
  stage: string;
  matchCode: string;
  opponentTeamId: string;
  opponentTeamName: string;
  goalsFor: number | null;
  goalsAgainst: number | null;
  result: string;
  resolution: string;
  isPending: boolean;
}

interface RawJourneyResponse {
  worldCupId: string;
  teamId: string;
  teamName: string;
  lang: string;
  worldCupStatus: string;
  stageReached: string;
  isChampion: boolean;
  isFinalPending: boolean;
  eliminatedByTeamId: string | null;
  eliminatedByTeamName: string | null;
  summary: string;
  matches: RawJourneyMatch[];
}

const JOURNEY_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
    message: 'El camino del equipo no está disponible. ¿Simulaste el mundial?',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
    message: 'No hay simulación activa en este momento.',
  },
};

const JOURNEY_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_JOURNEY_UNAVAILABLE,
  message: 'No se pudo cargar el camino del equipo desde la World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class JourneyService extends AbstractBaseService {
  
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  async getTeamJourney(lang: string = 'es') {
    try {
      const teamId = this.getCurrentTeamId(); 
      const rawData = await this.worldCupFeatureApiService.getTeamJourney(teamId, lang);
      
      return this.mapJourneyResponse(rawData as RawJourneyResponse, lang);
      
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, JOURNEY_API_ERROR_STATUS_MAP, JOURNEY_API_ERROR_FALLBACK);
    }
  }

  private mapJourneyResponse(data: RawJourneyResponse, lang: string) {
    const matchesPlayed = data.matches.filter((m: RawJourneyMatch) => !m.isPending).length;

    const mappedMatches = data.matches.map((match: RawJourneyMatch) => {
      const scoreLabel = match.isPending 
        ? '- vs -' 
        : `${match.goalsFor} - ${match.goalsAgainst}`;

      const opponentFlag = `assets/flags/${match.opponentTeamId}.svg`;

      return {
        ...match,
        stageLabel: this.translateStage(match.stage, lang),
        scoreLabel: scoreLabel,
        resultLabel: this.translateResult(match.result, lang),
        resultStyle: match.result, // WIN, LOSS, DRAW, PENDING
        resolutionLabel: this.translateResolution(match.resolution, lang),
        opponentFlag: opponentFlag
      };
    });

    return {
      ...data,
      stageReachedLabel: this.translateStage(data.stageReached, lang),
      matchesPlayed: matchesPlayed,
      matches: mappedMatches
    };
  }

  private translateStage(stage: string, lang: string): string {
    const stages: Record<string, string> = {
      'GROUP_STAGE': lang === 'es' ? 'Fase de Grupos' : 'Group Stage',
      'ROUND_OF_32': lang === 'es' ? '16avos de Final' : 'Round of 32',
      'ROUND_OF_16': lang === 'es' ? 'Octavos de Final' : 'Round of 16',
      'QUARTER_FINALS': lang === 'es' ? 'Cuartos de Final' : 'Quarter Finals',
      'SEMI_FINALS': lang === 'es' ? 'Semifinales' : 'Semi Finals',
      'FINAL': lang === 'es' ? 'Final' : 'Final',
    };
    return stages[stage] || stage;
  }

  private translateResult(result: string, lang: string): string {
    const results: Record<string, string> = {
      'WIN': lang === 'es' ? 'Victoria' : 'Win',
      'LOSS': lang === 'es' ? 'Derrota' : 'Loss',
      'DRAW': lang === 'es' ? 'Empate' : 'Draw',
      'PENDING': lang === 'es' ? 'Pendiente' : 'Pending',
    };
    return results[result] || result;
  }

  private translateResolution(resolution: string, lang: string): string {
    if (resolution === 'REGULAR_TIME') return '';
    if (resolution === 'EXTRA_TIME') return lang === 'es' ? '(TE)' : '(ET)';
    if (resolution === 'PENALTIES') return lang === 'es' ? '(PEN)' : '(PEN)';
    return '';
  }
}