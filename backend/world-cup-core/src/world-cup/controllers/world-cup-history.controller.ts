import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorldCupHistoryService } from '../services/world-cup-history.service';

@ApiTags('world-cup')
@Controller('world-cup')
export class WorldCupHistoryController {
  
  constructor(private readonly worldCupHistoryService: WorldCupHistoryService) {}

  @Get('historial')
  async getHistory() {
    return await this.worldCupHistoryService.getHistory();
  }
}

