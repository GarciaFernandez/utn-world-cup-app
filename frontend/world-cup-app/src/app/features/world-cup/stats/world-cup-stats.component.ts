import { Component, OnInit } from '@angular/core';
import { WorldCupStatsService } from './service/world-cup-stats.service';
import { WorldCupStatsViewModel } from './model/world-cup-stats-view-model.interface';

@Component({
  selector: 'app-world-cup-stats-page',
  standalone: false,
  templateUrl: './world-cup-stats.component.html',
  styleUrls: ['./world-cup-stats.component.css'],
})
export class WorldCupStatsPageComponent implements OnInit {
  
  public get vm(): WorldCupStatsViewModel {
    return this.statsService.vm;
  }

  constructor(private readonly statsService: WorldCupStatsService) {}

  ngOnInit(): void {
    this.statsService.loadStatsAndAwards().subscribe();
  }
}