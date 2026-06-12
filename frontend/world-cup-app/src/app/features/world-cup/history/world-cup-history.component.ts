import { Component, OnInit } from '@angular/core';
import { WorldCupHistoryService, WorldCupHistoryResponse } from './service/world-cup-history.service';

@Component({
  selector: 'app-world-cup-history-page',
  standalone: false,
  templateUrl: './world-cup-history.component.html',
  styleUrls: ['./world-cup-history.component.css']
})
export class WorldCupHistoryPageComponent implements OnInit {

  historyData?: WorldCupHistoryResponse['data'];

  constructor(private historyService: WorldCupHistoryService) {}

  ngOnInit(): void {
    this.historyService.getHistory().subscribe((res: WorldCupHistoryResponse) => {
      this.historyData = res.data;
    });
  }
}
