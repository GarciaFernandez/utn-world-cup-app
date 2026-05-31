import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { HistoricalRivalApiItem } from './model/rivals-service.interface'; 

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

  /** Obtiene la lista de rivales para el equipo configurado actualmente. */
  // Cambiamos Promise<any> por un array de tu interfaz tipada
  public async getRivals(): Promise<HistoricalRivalApiItem[]> { 
    try {
      const teamId = this.getCurrentTeamId();
      const rivalsResponse = await this.worldCupFeatureApiService.getHistoricalRivals(teamId);
      
      // TypeScript ahora sabe exactamente qué campos tiene cada rival adentro de la respuesta
      return rivalsResponse as HistoricalRivalApiItem[];
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, RIVALS_API_ERROR_STATUS_MAP, RIVALS_API_ERROR_FALLBACK);
    }
  }
}