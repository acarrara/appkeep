import { AppActions } from './app.actions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Epic } from '../redux/Epic';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { AppKeep } from './models/AppKeep';
import { ArrayableFunctions } from './ArrayableFunctions';
import { Statistics } from './models/Statistics';
import { StatisticsFactory } from './StatisticsFactory';

@Injectable()
export class AppEpics extends ArrayableFunctions<Epic<any, any>> {

  private statisticsFactory: StatisticsFactory = new StatisticsFactory();

  constructor(private actions: AppActions, private http: HttpClient) {
    super();
  }

  private loadAppKeeps: Epic<any, AppKeep[]> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_APPKEEPS),
      mergeMap(() => this.http.get<AppKeep[]>('/api/appkeeps').pipe(
        first(),
        map(appKeeps => this.actions.loadAppKeepsSuccess(appKeeps))
      ))
    );
  }

  private loadStatistics: Epic<any, Statistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_STATISTICS),
      mergeMap(() => this.http.get<any>('/api/appkeeps/statistics').pipe(
        first(),
        map(statistics => this.actions.loadStatisticsSuccess(this.statisticsFactory.create(statistics)))
      ))
    );
  }

  private addAppKeep: Epic<AppKeep, AppKeep> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.ADD_APPKEEP),
      mergeMap(action => this.http.post<AppKeep>('/api/appkeeps', action.payload).pipe(
        first(),
        map(appKeep => this.actions.addAppKeepSuccess(appKeep))
      ))
    );
  }

  private deleteAppKeep: Epic<AppKeep, AppKeep> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.DELETE_APPKEEP),
      mergeMap(action => this.http.delete<AppKeep>('/api/appkeeps/' + action.payload._id).pipe(
        first(),
        map(() => this.actions.deleteAppKeepSuccess(action.payload))
      ))
    );
  }
}
