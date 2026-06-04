import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { ApiErrorMappingRule, ApiErrorStatusMap, ErrorUtils } from '../../basic/error/error.utils';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';
import { WorldCupCoreErrorCode } from '../../basic/model/world-cup-core-error-code.enum';

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
      
      const journeyData = await this.worldCupFeatureApiService.getTeamJourney(teamId, lang);
      
      return journeyData;
      
    } catch (error) {
      ErrorUtils.mapWorldCupApiError(error, JOURNEY_API_ERROR_STATUS_MAP, JOURNEY_API_ERROR_FALLBACK);
    }
  }
}