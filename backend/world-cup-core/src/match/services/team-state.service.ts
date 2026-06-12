import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { CurrentWorldCupApiResponse } from '../../world-cup/services/model/simulation-service.interface';
import { TeamApiItem } from './helpers/team-state.interface';



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

  public async getTeamState(): Promise<TeamApiItem> {
    try {
    const currentWc = await this.checkWorldCupStatus();
    
    const lang = this.featureApi.getCurrentLang();
    if (currentWc.status == 'FINAL_ACTIVE') {
        return await this.featureApi.getTeamState(currentWc.finalMatchId.trim(), lang);
      
    } 
    {
     
    }

    } catch (error) {
      throw ErrorUtils.mapWorldCupApiError(error, TEAM_STATE_API_ERROR_STATUS_MAP, TEAM_STATE_API_ERROR_FALLBACK);
    }
  }
}