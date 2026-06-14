import { Component, OnInit, inject } from '@angular/core';
import { TeamStateViewModel } from './model/team-state-view-model.interface';
import { TeamStateTeamApiItem, TeamStatePlayerApiItem } from './model/team-state-api.interface';
import { TeamStateService } from './service/team-state.service';

@Component({
  selector: 'app-team-state-page',
  standalone: false,
  templateUrl: './team-state.component.html',
  styleUrls: ['./team-state.component.css'],
})
export class TeamStatePageComponent implements OnInit {
  private readonly pageService = inject(TeamStateService);

  get pageState(): TeamStateViewModel {
    return this.pageService.getViewModel();
  }

  ngOnInit(): void {
    this.pageService.initialize();
  }

  getEnergyLabel(player: TeamStatePlayerApiItem): string {
    if (player.energyLabel) return player.energyLabel;
    if (player.energy > 70) return 'Alto';
    if (player.energy >= 40) return 'Medio';
    return 'Bajo';
  }

  getEnergyClass(energyLabel: string): string {
    const label = (energyLabel ?? '').toLowerCase();
    if (label === 'alto' || label === 'high') return 'badge-green';
    if (label === 'bajo' || label === 'low') return 'badge-red';
    return 'badge-gray';
  }

  getPositionTag(player: TeamStatePlayerApiItem): string {
    if (player.positionTag) return player.positionTag;
    const pos = (player.position ?? '').toUpperCase();
    if (pos.includes('GOAL') || pos === 'POR' || pos === 'GK') return 'GK';
    if (pos.includes('DEF') || pos === 'DF' || pos === 'CB' || pos === 'LB' || pos === 'RB' || pos === 'LWB' || pos === 'RWB') return 'DF';
    if (pos.includes('MID') || pos === 'MF' || pos === 'CM' || pos === 'CDM' || pos === 'CAM' || pos === 'LM' || pos === 'RM' || pos === 'DM') return 'MF';
    return 'FW';
  }

  getTacticalValue(team: TeamStateTeamApiItem, key: 'attack' | 'defense' | 'midfield'): number {
    return team?.tactical?.[key] ?? 0;
  }

  private readonly positionOrder: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 };

  sortByPosition(players: TeamStatePlayerApiItem[]): TeamStatePlayerApiItem[] {
    return [...players].sort((a, b) => {
      const pa = this.positionOrder[this.getPositionTag(a)] ?? 4;
      const pb = this.positionOrder[this.getPositionTag(b)] ?? 4;
      return pa - pb;
    });
  }
}
