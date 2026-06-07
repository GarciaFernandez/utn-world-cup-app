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

  /** Endpoint para dar inicio a la final */
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

  /** Endpoint para ejecutar las decisiones tácticas del partido turno por turno */
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

/** Endpoint para poblar el selector de estrategias durante la final */
  @Get('strategies')
  @ApiOperation({ summary: 'World Cup - Obtener estrategias disponibles para el partido corriente' })
  public async getMatchStrategies() {
    const result = await this.playFinalService.getMatchStrategies();
    return this.createOkResponse(result);
  }

  /** Endpoint para poblar el selector de formaciones durante la final */
  @Get('formations')
  @ApiOperation({ summary: 'World Cup - Obtener formaciones disponibles para el partido corriente' }) 
  public async getMatchFormations() {
    const result = await this.playFinalService.getMatchFormations();
    return this.createOkResponse(result);
  }

  /** Endpoint para cambiar la estrategia sobre la marcha en el transcurso del partido */
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

  /** Endpoint para cambiar la formación sobre la marcha en el transcurso del partido */
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