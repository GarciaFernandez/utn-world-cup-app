import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AbstractBaseService } from 'src/basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from 'src/basic/error/error.utils';
import { WorldCupCoreErrorCode } from 'src/basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from 'src/basic/world-cup-feature-api.service';
import { CoachAndStrategyResponse, CoachModel, CoachingTeamFormation, CoachingTeamStrategy, CoachingTeamStats } from './model/coach-service-model';
import { CoachProfiles } from './model/coach-service.interface';
import { ResetTeamTacticsApiResponse, SelectMatchStrategyApiResponse, SelectMatchFormationApiResponse } from 'src/match/services/helpers/match-tactics.interface';


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
    message: 'Formation was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_FORMATION_UNAVAILABLE,
    message: 'Formation data is not available right now. Try again in a moment.',
  },
};
const FORMATION_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_FORMATION_UNAVAILABLE,
  message: 'Unable to load formation data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};


const RESET_TEAM_TACTICS_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_RESET_UNAVAILABLE,
    message: 'Could not reset team tactics because formation data was not found.',
  },
  [HttpStatus.CONFLICT]: {
    messageCode: WorldCupCoreErrorCode.WC_RESET_UNAVAILABLE,
    message: 'Could not reset team tactics. Try again in a moment.',
  },
};
const RESET_TEAM_TACTICS_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_RESET_UNAVAILABLE,
  message: 'Unable to reset team tactics.',
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

    public async saveStrategy (
      teamId: string, 
      strategy: string, 
      lang?: string
    ): Promise<SelectMatchStrategyApiResponse> {
      try {       
          const response = await this.worldCupFeatureApiService.selectMatchStrategy(teamId, strategy, lang);
          return response;
      } catch (error) {
        ErrorUtils.mapWorldCupApiError(error, STRATEGY_API_ERROR_STATUS_MAP, STRATEGY_API_ERROR_FALLBACK);
      }
    }

    public async saveFormation (
      teamId: string, 
      formation: string, 
      lang?: string
    ): Promise<SelectMatchFormationApiResponse> {
      try {       
          const response = await this.worldCupFeatureApiService.selectMatchFormation(teamId, formation, lang);
          return response;
      } catch (error) {
        ErrorUtils.mapWorldCupApiError(error, FORMATION_API_ERROR_STATUS_MAP, FORMATION_API_ERROR_FALLBACK);
      }
    }

    public async resetTeamTactics (
      teamId: string
    ): Promise<ResetTeamTacticsApiResponse> {
      try {       
          const response = await this.worldCupFeatureApiService.resetTeamTactics(teamId);
          return response;
      } catch (error) {
        ErrorUtils.mapWorldCupApiError(error, RESET_TEAM_TACTICS_API_ERROR_STATUS_MAP, RESET_TEAM_TACTICS_API_ERROR_FALLBACK);
      }
    }



    public async getCoachAndStrategy(
        teamId?: string, 
        lang?: string, 
      ): Promise<CoachAndStrategyResponse> {
        try {

          const coachResponse = await this.worldCupFeatureApiService.getTeamCoaching(teamId);
          const coach = coachResponse[0];

          const profileData = await this.worldCupFeatureApiService.getTeamCoachProfile(teamId);
          const myProfileData = filterProfileDataForCoach(profileData.coachProfiles, coach.profile);

          const myCoach = new CoachModel({
              coachId: coach.coachId,
              teamId: coach.teamId,
              name: coach.name,
              age: coach.age,
              nationality: coach.nationality, 
              profile: coach.profile,
              profileLabel: myProfileData.label,
              profileDescription: myProfileData.description,
              riskAppetite: coach.riskAppetite,
              gameManagement: coach.gameManagement,
              adaptability: coach.adaptability,
              pressingBias: coach.pressingBias,
              possessionBias: coach.possessionBias,
              defenseBias: coach.defenseBias,
              maxStrategyChanges: coach.maxStrategyChanges
          });

          const strategyResponse = await this.worldCupFeatureApiService.getTeamStrategy(teamId);
 
          const myStrategy = new CoachingTeamStrategy({
            teamId: strategyResponse.teamId, 
            strategy: strategyResponse.strategy
          });

          const formationResponse = await this.worldCupFeatureApiService.getTeamFormation(teamId);
          
          const myFormation = new CoachingTeamFormation({
            teamId: formationResponse.teamId,
            formation: formationResponse.formation
          });

          const statsResponse = await this.worldCupFeatureApiService.getTeamStats(teamId);
          
          const myStats = new CoachingTeamStats();
          myStats.attack = statsResponse.attack;
          myStats.defense = statsResponse.defense;
          myStats.midfield = statsResponse.midfield;
          myStats.overall = statsResponse.overall;
          myStats.current_strategy = statsResponse.current_strategy;
          myStats.current_formation = statsResponse.current_formation;

          const allStrategies = await this.worldCupFeatureApiService.getMatchStrategies(lang);

          const allFormations = await this.worldCupFeatureApiService.getMatchFormations(lang);

          const myBaseRatings = this.createBaseRatings(myStats);

          const myResponse = new CoachAndStrategyResponse();
          myResponse.coach = myCoach; 
          myResponse.strategy = myStrategy;  
          myResponse.formation = myFormation;  
          myResponse.stats = myStats;
          myResponse.strategies = allStrategies;
          myResponse.formations = allFormations;
          myResponse.baseRatings = myBaseRatings;

          return myResponse;

        } catch (error) {
          ErrorUtils.mapWorldCupApiError(error, COACH_API_ERROR_STATUS_MAP, COACH_API_ERROR_FALLBACK);
        }
      }

  createBaseRatings(myStats: CoachingTeamStats) {
    const baseRatings = [];
    baseRatings.push({metric: 'Attack', value: myStats.attack});  
    baseRatings.push({metric: 'Defense', value: myStats.defense});
    baseRatings.push({metric: 'Midfield', value: myStats.midfield});
    baseRatings.push({metric: 'Overall', value: myStats.overall});
    return baseRatings;
  }
}

function filterProfileDataForCoach(profileData: CoachProfiles[], profile: string) {
  let myProfileData = null;
  for (const p of profileData) {
    if(p.code === profile) {
      myProfileData = p;
    }
  }
  return myProfileData;
}



