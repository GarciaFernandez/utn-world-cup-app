import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LiveEventsService } from '../services/live-events.service';

@ApiTags('final-match')
@Controller('final-match')
export class LiveEventsController {
  constructor(private readonly liveEventsService: LiveEventsService) {}

  @Get('live-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener eventos en vivo de la final' })
  @ApiResponse({ status: 200, description: 'Eventos obtenidos correctamente.' })
  async getLiveEvents(
    @Query('lang') lang: 'es' | 'en' = 'es',
  ): Promise<unknown> {
    return this.liveEventsService.getLiveEvents(lang);
  }
}