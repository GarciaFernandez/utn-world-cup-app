import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { ResponseObject } from '../../basic/response-object';
import { TeamStateService } from '../services/team-state.service';
import { TeamApiItem } from '../services/helpers/team-state.interface';

@ApiTags('final-match')
@Controller('final-match')
export class TeamStateController extends AbstractController {
  constructor(
    private readonly teamStateService: TeamStateService,
  ) {
    super();
  }

  @Get('team-state')
  @ApiOperation({ summary: 'Obtiene el estado de los equipos para la final.' })
  public async getTeamState(): Promise<ResponseObject<TeamApiItem>> {
    const teamState = await this.teamStateService.getTeamState();
    return this.createOkResponse(teamState);
  }
}
