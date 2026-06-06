import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { PlayFinalService } from '../services/play-final.service';

@ApiTags('final-match') // Lo agrupamos en la misma sección de Swagger
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
}