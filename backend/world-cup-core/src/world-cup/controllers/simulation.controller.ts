import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { CurrentWorldCupQueryRequest } from './request/current-world-cup-query.request';
import { SimulationService } from '../services/simulation.service';
import {ResponseObject} from '../../basic/response-object';
import {
  CurrentWorldCupApiResponse,
  FinalistPreview,
  SimulationScreenResponse,
  TeamCatalogApiItem,
  TeamStatsApiResponse,
} from '../services/model/simulation-service.interface';
@ApiTags('world-cup')
@Controller('world-cup')
export class SimulationController extends AbstractController {
  /** Exposes simulation endpoints and delegates logic to SimulationService. */
  constructor(private readonly simulationService: SimulationService) {
    super();
  }

  /** Returns current world cup metadata for the active simulation context. */
  @Get('current')
  @ApiOperation({ summary: 'World Cup - current simulation component' })
  @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
  public async getCurrent(@Query() request: CurrentWorldCupQueryRequest): Promise<unknown> {
    return this.createOkResponse(await this.simulationService.getCurrentWorldCup(request.lang));
  }

  /** Runs a world cup simulation and returns updated current metadata. */
  @Post('simulate')
  @ApiOperation({ summary: 'World Cup - run simulation action' })
  public async simulate(): Promise<ResponseObject<SimulationScreenResponse>> {
    return this.createOkResponse(await this.simulationService.simulate());
  }
}
