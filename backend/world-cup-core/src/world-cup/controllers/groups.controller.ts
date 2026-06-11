import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { GroupsService } from '../services/groups.service';

@ApiTags('world-cup')
@Controller('world-cup')
export class GroupsController extends AbstractController {
  constructor(private readonly groupsService: GroupsService) {
    super();
  }

  @Get('groups')
  @ApiOperation({ summary: 'Fase de Grupos - tablas de posiciones del mundial actual' })
  public async getGroups(): Promise<unknown> {
    return this.createOkResponse(await this.groupsService.getGroups());
  }
}
