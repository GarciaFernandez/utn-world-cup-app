import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { PlayFinalService } from '../services/play-final.service';
@ApiTags('final-match') 
@Controller('play-final')
export class PlayFinalController extends AbstractController {
  constructor(private readonly playFinalService: PlayFinalService) {
    super();
  }

  @Post('start-final')
  @ApiOperation({ summary: 'World Cup - Iniciar el partido de la final' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teamId: { type: 'string', example: 'tun' },
        lang: { type: 'string', example: 'es', nullable: true }
      },
      required: ['teamId']
    }
  })
  public async startFinal(@Body() body: { teamId: string; lang?: string }) {
    const result = await this.playFinalService.startFinal(body.teamId, body.lang);
    return this.createOkResponse(result);
  }

  @Post('play')
  @ApiOperation({ summary: 'World Cup - Jugar turno del partido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        selectedOption: { type: 'string', example: 2 },
        lang: { type: 'string', example: 'es', nullable: true }
      },
      required: ['matchId', 'selectedOption']
    }
  })
  public async playTurn(@Body() body: { matchId: string; selectedOption: string; lang?: string }) {
    const result = await this.playFinalService.playTurn(body.matchId, body.selectedOption, body.lang);
    return this.createOkResponse(result);
  }

  @Get('strategies')
  @ApiOperation({ summary: 'World Cup - Obtener estrategias disponibles para el partido corriente' })
  public async getMatchStrategies() {
    const result = await this.playFinalService.getMatchStrategies();
    return this.createOkResponse(result);
  }

  @Get('formations')
  @ApiOperation({ summary: 'World Cup - Obtener formaciones disponibles para el partido corriente' }) 
  public async getMatchFormations() {
    const result = await this.playFinalService.getMatchFormations();
    return this.createOkResponse(result);
  }

  @Post('select-strategy')
  @ApiOperation({ summary: 'World Cup - Cambiar estrategia en medio del partido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teamId: { type: 'string', example: 'tun', nullable: true },
        strategy: { type: 'string', example: 'ATTACK' },
        lang: { type: 'string', example: 'es', nullable: true }
      },
      required: ['strategy']
    }
  })
  public async selectMatchStrategy(@Body() body: { teamId?: string; strategy: string; lang?: string }) {
    const result = await this.playFinalService.selectMatchStrategy(body.teamId, body.strategy, body.lang);
    return this.createOkResponse(result);
  }

  @Post('select-formation')
  @ApiOperation({ summary: 'World Cup - Cambiar formación en medio del partido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teamId: { type: 'string', example: 'tun', nullable: true },
        formation: { type: 'string', example: '4-3-3' },
        lang: { type: 'string', example: 'es', nullable: true }
      },
      required: ['formation']
    }
  })
  public async selectMatchFormation(@Body() body: { teamId?: string; formation: string; lang?: string }) {
    const result = await this.playFinalService.selectMatchFormation(body.teamId, body.formation, body.lang);
    return this.createOkResponse(result);
  }
}