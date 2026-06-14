import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { HistoricalRivalApiItem, EnrichedRivalApiItem } from './model/rivals-service.interface'; 

const RIVALS_API_ERROR_STATUS_MAP: ApiErrorStatusMap = {
  [HttpStatus.NOT_FOUND]: {
    messageCode: WorldCupCoreErrorCode.WC_RIVALS_UNAVAILABLE,
    message: 'Rivals data for the selected team was not found.',
  },
};

const RIVALS_API_ERROR_FALLBACK: ApiErrorMappingRule = {
  messageCode: WorldCupCoreErrorCode.WC_RIVALS_UNAVAILABLE,
  message: 'Unable to load rivals data from World Cup API.',
  statusCode: HttpStatus.BAD_GATEWAY,
};

@Injectable()
export class RivalsService extends AbstractBaseService {

  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getRivals(): Promise<EnrichedRivalApiItem[]> { 
    try {
      const teamId = this.getCurrentTeamId();
      const rivalsResponse = await this.worldCupFeatureApiService.getHistoricalRivals(teamId);
      const baseRivals = rivalsResponse as HistoricalRivalApiItem[];

      return await Promise.all(
        baseRivals.map(async (rival) => {
          const teamDetailsResponse = await this.worldCupFeatureApiService.getTeamDetailById(rival.id);
          
          const dataArray = teamDetailsResponse?.data ?? teamDetailsResponse;
          const details = Array.isArray(dataArray) ? dataArray[0] : dataArray;

          return {
            id: rival.id,
            name: rival.name,
            group: details?.group,
            footballAssociation: details?.footballAssociation,
            rating: details?.rating,
            coach: details?.coach,
            captain: details?.captain,
            strategy: details?.strategy,
            formation: details?.formation
          };
        })
      );
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, RIVALS_API_ERROR_STATUS_MAP, RIVALS_API_ERROR_FALLBACK);
    }
  }
}