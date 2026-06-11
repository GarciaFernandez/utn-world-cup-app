import { Injectable } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { AbstractBaseService } from '../../basic/abstract-base.service';
import { WorldCupFeatureApiService } from '../../basic/world-cup-feature-api.service';

export interface GroupsResponseModel {
  teamId: string;
  selectedGroup: string | null;
  groups: any[];
}

@Injectable()
export class GroupsService extends AbstractBaseService {
  constructor(
    private readonly worldCupFeatureApiService: WorldCupFeatureApiService,
    adminService: AdminService,
  ) {
    super(adminService);
  }

  public async getGroups(): Promise<GroupsResponseModel> {
    const teamId = this.getCurrentTeamId();
    const groups = await this.worldCupFeatureApiService.getCurrentGroups();

    const selectedGroup = groups.find((g) =>
      g.teams.some((t) => t.teamId === teamId),
    )?.group ?? null;

    return { teamId, selectedGroup, groups };
  }
}
