import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { JourneyService } from './service/journey.service';
import { JourneyViewModel } from './model/journey-view-model.interface';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyPageComponent implements OnInit { 
  pageState$!: Observable<JourneyViewModel>;

  constructor(private journeyService: JourneyService) {}

  ngOnInit(): void {
    this.pageState$ = this.journeyService.getViewModel();
    this.journeyService.loadJourney();
  }
}