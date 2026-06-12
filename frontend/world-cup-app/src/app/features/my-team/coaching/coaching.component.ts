import { Component, OnInit } from '@angular/core';
import { CoachingService } from './service/coaching.service';
import { CoachingViewModel } from './model/coaching-view-model.interface';
import { CoachingTeamRatingDeltaItem } from './model/coaching-api.interface';

@Component({
  selector: 'app-coaching-page',
  standalone: false,
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.css'],
})
export class CoachingPageComponent implements OnInit {

  
  constructor(protected readonly coachingService: CoachingService) {}
  
  get pageState(): CoachingViewModel {
    return this.coachingService.getViewModel();
  }   
  public ngOnInit(): void {
    this.coachingService.initialize();
  }
  
  getRatingDelta(metric: string): CoachingTeamRatingDeltaItem | null {
    return this.pageState.ratingDeltas?.find(
      delta => delta?.metric?.toLowerCase() === metric.toLowerCase()
    ) ?? null;
  }

  getBaseValue(metric: string): number {
    return this.pageState.baseRatings?.find(
      ratings => ratings.metric.toLowerCase() === metric.toLowerCase()
    )?.value ?? 0;
  }

 }