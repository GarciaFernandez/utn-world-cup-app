import { Component, OnInit } from '@angular/core';
import { TeamStateViewModel } from './model/team-state-view-model.interface';
import { TeamStateService } from './service/team-state.service';

@Component({
  selector: 'app-team-state-page',
  standalone: false,
  templateUrl: './team-state.component.html',
  styleUrls: ['./team-state.component.css'],
})

export class TeamStatePageComponent implements OnInit {
  constructor(private readonly pageService: TeamStateService) {}

  get pageState(): TeamStateViewModel {
    return this.pageService.getViewModel();
  }

  ngOnInit(): void {
    this.pageService.initialize();
  }
}
