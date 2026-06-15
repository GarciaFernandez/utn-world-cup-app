import { Component, OnInit } from '@angular/core';
import { RivalsService } from './service/rivals.service'; 
import { RivalsViewModel } from './model/rivals-view-model.interface'; 
import { UiVisualsService } from '../../../core/services/ui-visuals.service'; 

@Component({
  selector: 'app-rivals-page',
  standalone: false,
  templateUrl: './rivals.component.html',
  styleUrls: ['./rivals.component.css'],
})
export class RivalsPageComponent implements OnInit {

  constructor(
    private readonly rivalsService: RivalsService
  ) {}

  get pageState(): RivalsViewModel {
    return this.rivalsService.getViewModel();
  }

  public ngOnInit(): void {
    this.rivalsService.initialize();
  }

  public getFlagEmoji(teamId: string): string {
    const id = teamId?.toLowerCase().trim();

    const flagMap = (UiVisualsService as any).TEAM_FLAGS as Record<string, string>;
    
    return flagMap && flagMap[id] ? flagMap[id] : '🏳️';
  }
}