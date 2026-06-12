import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { CoachingService } from '../services/coaching.service';
import { CoachQueryRequest, SaveStrategyRequest, SaveFormationRequest, ResetTeamTacticsRequest } from './request/coach-query.request';

@ApiTags('my-team')
@Controller('my-team')
export class CoachingController extends AbstractController{
  
  constructor(private readonly coachingService: CoachingService) { 
      super();
    }

    @Get('coach')
    @ApiOperation({ summary: 'My Team - Coach' })
    @ApiQuery({ name: 'teamId', required: true })
    @ApiQuery({ name: 'lang', required: false })
    public async getCoach(@Query() request: CoachQueryRequest): Promise<unknown> {
      return this.createOkResponse(
        await this.coachingService.getCoachAndStrategy(request.teamId, request.lang),
      );
    }

    @Post('saveStrategy')
    @ApiOperation({ summary: 'Save Strategy for My Team' })
    public async saveStrategy(@Body() request: SaveStrategyRequest): Promise<unknown> {
        return this.createOkResponse(
          await this.coachingService.saveStrategy(request.teamId, request.strategy, request.lang),
        );
    }

    @Post('saveFormation')
    @ApiOperation({ summary: 'Save Formation for My Team' })
    public async saveFormation(@Body() request: SaveFormationRequest): Promise<unknown> {
        return this.createOkResponse(
          await this.coachingService.saveFormation(request.teamId, request.formation, request.lang),
        );
    }

    @Post('resetTeamTactics')
    @ApiOperation({ summary: 'Reset Team Tactics' })
    public async resetTeamTactics(@Body() request: ResetTeamTacticsRequest): Promise<unknown> {
        return this.createOkResponse(
          await this.coachingService.resetTeamTactics(request.teamId),
        );
    }
}
