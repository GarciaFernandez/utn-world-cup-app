import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JourneyService } from '../services/journey.service';

@ApiTags('World Cup Journey')
@Controller('world-cup/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el camino del equipo seleccionado' })
  @ApiResponse({ status: 200, description: 'Camino del equipo retornado exitosamente.' })
  @ApiResponse({ status: 404, description: 'El camino del equipo no está disponible.' })
  async getJourney() {
    return await this.journeyService.getTeamJourney();
  }
}