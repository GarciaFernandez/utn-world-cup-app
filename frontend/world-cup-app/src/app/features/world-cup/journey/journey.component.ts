import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JourneyService } from './service/journey.service'; 
import { JourneyViewModel } from './model/journey-view-model.interface'; 
import { UiVisualsService } from '../../../core/services/ui-visuals.service'; 

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyPageComponent implements OnInit, OnDestroy {
  
  public pageState!: JourneyViewModel; 
  private subscription: Subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private uiVisuals: UiVisualsService 
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.journeyService.getViewModel().subscribe((state: JourneyViewModel) => {
        this.pageState = state;
      })
    );
    this.journeyService.loadJourney();
  }


  getFlag(teamId: string): string {
    return this.uiVisuals.getTeamFlag(teamId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}