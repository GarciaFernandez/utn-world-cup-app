import { Component, OnInit } from '@angular/core';
import { CoachingService } from './service/coaching.service';
import { CoachingViewModel } from './model/coaching-view-model.interface';

@Component({
  selector: 'app-coaching-page',
  standalone: false,
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.css'],
})
export class CoachingPageComponent implements OnInit {

  
  pageState!: CoachingViewModel;

  constructor(private readonly coachingService: CoachingService) {}
  
  public ngOnInit(): void {
    this.coachingService.initialize();
    this.pageState = this.coachingService.getViewModel();
  }
  
 }