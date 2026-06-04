import { Controller, Get } from '@nestjs/common';
import { JourneyService } from '../services/journey.service';

@Controller('world-cup/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Get()
  async getJourney() {
    return await this.journeyService.getTeamJourney();
  }
}