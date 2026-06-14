import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { CurrentWorldCupApiResponse } from '../../world-cup/services/model/simulation-service.interface';
import {
  MatchSquadApiResponse,
  TeamSquadApiItem,
  TeamStateMappedItem,
  TeamStateMappedResponse,
} from './helpers/team-state.interface';


const TEAM_STATE_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_TEAM_STATE_UNAVAILABLE,
    message: 'Los datos de la alineación no están disponibles.',
  },
};

const TEAM_STATE_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_TEAM_STATE_UNAVAILABLE,
  message: 'No es posible acceder a los datos de la World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

const EMPTY_TACTICAL = { attack: 0, defense: 0, midfield: 0 };

@Injectable()
export class TeamStateService extends AbstractBaseService {

  constructor(
    private readonly featureApi: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async checkWorldCupStatus(): Promise<CurrentWorldCupApiResponse> {
    return await this.featureApi.getCurrentWorldCup();
  }

  public async getTeamState(): Promise<TeamStateMappedResponse> {
    try {
      const currentWc = await this.checkWorldCupStatus();
      const lang = this.featureApi.getCurrentLang();

      if (currentWc.status === 'FINAL_ACTIVE' && currentWc.finalMatchId) {
        const matchId = currentWc.finalMatchId.trim();
        const squadData = await this.featureApi.getTeamState(matchId, lang);
        return this.mapSquadToTeamState(squadData, String(lang));
      }

      throw new BadRequestException('No hay una final activa.');
    } catch (error) {
      throw ErrorUtils.mapWorldCupApiError(error, TEAM_STATE_API_ERROR_STATUS_MAP, TEAM_STATE_API_ERROR_FALLBACK);
    }
  }

  private mapSquadToTeamState(squad: MatchSquadApiResponse, lang: string): TeamStateMappedResponse {
    return {
      matchId: squad.matchId,
      teamId: squad.team?.id ?? '',
      lang,
      isActive: squad.isActive,
      isFinished: squad.isFinished,
      minute: squad.minute,
      turn: squad.turn,
      score: squad.score,
      team: this.mapTeamItem(squad.team),
      opponent: this.mapTeamItem(squad.opponent),
    };
  }

  private mapTeamItem(t: TeamSquadApiItem): TeamStateMappedItem {
    const tactical = t?.tacticalBreakdown?.effectiveTeamLine ?? EMPTY_TACTICAL;
    return {
      id: t?.id ?? '',
      name: t?.name ?? '',
      flag: '',
      formation: t?.formation ?? '',
      strategy: t?.strategy ?? '',
      strategyLabel: '',
      coachName: t?.coachName ?? '',
      coachProfile: t?.coachProfile ?? '',
      tactical,
      maxSubstitutions: t?.maxSubstitutions ?? 0,
      substitutionsUsed: t?.substitutionsUsed ?? 0,
      remainingSubstitutions: t?.remainingSubstitutions ?? 0,
      onFieldCount: t?.onFieldCount ?? 0,
      onField: t?.onField ?? [],
      bench: t?.bench ?? [],
    };
  }
}
