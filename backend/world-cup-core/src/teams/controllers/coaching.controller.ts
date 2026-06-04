import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { CoachingService } from '../services/coaching.service';
import { CoachQueryRequest } from './request/coach-query.request';

@ApiTags('my-team')
@Controller('my-team')
export class CoachingController extends AbstractController{
  
  constructor(private readonly coachingService: CoachingService) {
      super();
    }

    @Get('coach')
    @ApiOperation({ summary: 'My Team - Coach' })
    @ApiQuery({ name: 'teamId', required: true })
    public async getCoach(@Query() request: CoachQueryRequest): Promise<unknown> {
      return this.createOkResponse(
        await this.coachingService.getCoach(request.teamId),
      );
    }
}
