import {
  Controller,
  Get,
  Query,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorldCupHistoryService } from '../services/world-cup-history.service';

@ApiTags('world-cup')
@Controller('world-cup')
export class WorldCupHistoryController {
  private readonly logger = new Logger(WorldCupHistoryController.name);

  constructor(
    private readonly worldCupHistoryService: WorldCupHistoryService
  ) {}

@Get('history')
async getHistory(@Query('lang') lang = 'es') {
  try {
    const result = await this.worldCupHistoryService.getHistory();

    return {
      success: result.success,
      data: result.data ?? [],
      message: result.message
    };
  } catch (error) {
    this.logger.error('Error al obtener el historial', error);

    throw new InternalServerErrorException(
      'Error al procesar el historial'
    );
  }
<<<<<<< Updated upstream
=======
}
>>>>>>> Stashed changes
}