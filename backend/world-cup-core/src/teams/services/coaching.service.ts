import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from 'src/basic/error/error.utils';
import { WorldCupCoreErrorCode } from 'src/basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';
import { CoachModel } from './model/coach-service-model';
import { StrategyModel } from './model/strategy-service-model';
import { FormationModel } from './model/formation-service-model';

const COACH_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_COACHING_UNAVAILABLE,
    message: 'Coach was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_COACHING_UNAVAILABLE,
    message: 'Coach data is not available right now. Try again in a moment.',
  },
};

const COACH_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_COACHING_UNAVAILABLE,
  message: 'Unable to load coach data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

const STRATEGY_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_STRATEGY_UNAVAILABLE,
    message: 'Strategy was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_STRATEGY_UNAVAILABLE,
    message: 'Strategy data is not available right now. Try again in a moment.',
  },
};
const STRATEGY_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_STRATEGY_UNAVAILABLE,
  message: 'Unable to load strategy data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

const FORMATION_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_FORMATION_UNAVAILABLE,
    message: 'Strategy was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_STRATEGY_UNAVAILABLE,
    message: 'Formation data is not available right now. Try again in a moment.',
  },
};
const FORMATION_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_FORMATION_UNAVAILABLE,
  message: 'Unable to load formation data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class CoachingService extends AbstractBaseService{
  constructor(
      private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
      adminService: AdminService,
    ) {
      super(adminService);
    }

    public async getCoach(
        teamId?: string,
      ): Promise<CoachModel> {
        try {
          const coachResponse = await this.worldCupFeatureApiService.getTeamCoaching(teamId);
          const coach = coachResponse[0];
          
          const myCoach = new CoachModel({
              coachId: coach.coachId,
              teamId: coach.teamId,
              name: coach.name,
              age: coach.age,
              nationality: coach.nationality,
              profile: coach.profile,
              riskAppetite: coach.riskAppetite,
              gameManagement: coach.gameManagement,
              adaptability: coach.adaptability,
              pressingBias: coach.pressingBias,
              possessionBias: coach.possessionBias,
              defenseBias: coach.defenseBias,
              maxStrategyChanges: coach.maxStrategyChanges
          });

          return myCoach;

        } catch (error) {
          ErrorUtils.mapWorldCupApiError(error, COACH_API_ERROR_STATUS_MAP, COACH_API_ERROR_FALLBACK);
        }
      }

      public async getStrategy(
        teamId?: string,
      ): Promise<StrategyModel> {
        try {
          const strategyResponse = await this.worldCupFeatureApiService.getTeamStrategy(teamId);
          const strategy = strategyResponse[0];
          
          const myStrategy = new StrategyModel({
              teamId: strategy.teamId,
              strategy: strategy.teamId
          });

          return myStrategy;

        } catch (error) {
          ErrorUtils.mapWorldCupApiError(error, STRATEGY_API_ERROR_STATUS_MAP, STRATEGY_API_ERROR_FALLBACK);
        }
      }

      public async getFormation(
        teamId?: string,
      ): Promise<FormationModel> {
        try {
          const formationResponse = await this.worldCupFeatureApiService.getTeamFormation(teamId);
          const formation = formationResponse[0];
          
          const myFormation = new FormationModel({
              teamId: formation.teamId,
              formation: formation.teamId
          });

          return myFormation;

        } catch (error) {
          ErrorUtils.mapWorldCupApiError(error, FORMATION_API_ERROR_STATUS_MAP, FORMATION_API_ERROR_FALLBACK);
        }
      }
}
