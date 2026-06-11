import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { GroupsApiResponse } from '../model/groups-api.interface';
import { GroupsViewModel } from '../model/groups-view-model.interface';

@Injectable({ providedIn: 'root' })
export class GroupsService extends BaseApiService {
  private readonly pageState: GroupsViewModel = {
    lang: 'es',
    loading: false,
    errorMessage: '',
    showNoSimulationState: false,
    selectedTeamLabel: '',
    selectedGroup: null,
    selectedGroupData: null,
    groups: [],
  };

  getViewModel(): GroupsViewModel {
    return this.pageState;
  }

  initialize(): void {
    this.loadGroups().subscribe();
  }

  private loadGroups(): Observable<void> {
    this.pageState.loading = true;
    this.pageState.errorMessage = '';

    return this.get<GroupsApiResponse>('/world-cup/groups').pipe(
      map((response) => response.data),
      tap((data) => {
        this.pageState.groups = data?.groups ?? [];
        this.pageState.selectedGroup = data?.selectedGroup ?? null;
        this.pageState.selectedGroupData =
          this.pageState.groups.find((g) => g.group === this.pageState.selectedGroup) ?? null;
        this.pageState.showNoSimulationState = this.pageState.groups.length === 0;
      }),
      map(() => undefined),
      catchError(() => {
        this.pageState.errorMessage = 'No se pudo cargar la fase de grupos.';
        this.pageState.showNoSimulationState = true;
        return of(undefined);
      }),
      finalize(() => (this.pageState.loading = false)),
    );
  }
    selectGroup(groupName: string): void {
    this.pageState.selectedGroup = groupName;
    this.pageState.selectedGroupData =
      this.pageState.groups.find((g) => g.group === groupName) ?? null;
  }

}
