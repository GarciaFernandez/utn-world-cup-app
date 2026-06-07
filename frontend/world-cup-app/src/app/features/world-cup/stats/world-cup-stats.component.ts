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
  
  // Getter reactivo para enganchar el estado centralizado del servicio con el HTML
  public get vm(): WorldCupStatsViewModel {
    return this.statsService.vm;
  }

  constructor(private readonly statsService: WorldCupStatsService) {}

  ngOnInit(): void {
    // Gatillamos la carga de datos limpia al inicializar la pantalla
    this.statsService.loadStatsAndAwards().subscribe();
  }
}