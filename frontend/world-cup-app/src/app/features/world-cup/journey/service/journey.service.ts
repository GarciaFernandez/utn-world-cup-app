import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JourneyViewModel } from '../model/journey-view-model.interface'; 
import { JourneyApiResponse } from '../model/journey-api.interface';        

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private initialState: JourneyViewModel = {
    loading: false,
    error: false,
    noData: false,
    data: null 
  };

  private pageState = new BehaviorSubject<JourneyViewModel>(this.initialState);

  constructor(private http: HttpClient) {}

  getViewModel(): Observable<JourneyViewModel> {
    return this.pageState.asObservable();
  }

  loadJourney(): void {
    this.pageState.next({ ...this.initialState, loading: true });

    this.http.get<JourneyApiResponse>('http://localhost:4101/worldCupCore/world-cup/journey')
      .subscribe({
        next: (response) => {
          this.pageState.next({
            loading: false,
            error: false,
            noData: false,
            data: response
          });
        },
        error: (err: HttpErrorResponse) => {
          if (err.error?.messageCode === 'WC_JOURNEY_UNAVAILABLE' || err.status === 409 || err.status === 404) {
            this.pageState.next({ ...this.initialState, noData: true });
          } else {
            this.pageState.next({ ...this.initialState, error: true });
          }
        }
      });
  }
}