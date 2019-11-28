import { AppActions } from './app.actions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Epic } from '../redux/Epic';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { AppKeep } from './models/AppKeep';
import { ArrayableFunctions } from './ArrayableFunctions';
import { Statistics } from './models/Statistics';
import { StatisticsFactory } from './StatisticsFactory';
import { Option } from './models/Option';
import { RestEpic } from './RestEpic';
import { User } from './models/User';
import { zip } from 'rxjs';
import { CategoryStatistics } from './models/CategoryStatistics';

@Injectable()
export class AppEpics extends ArrayableFunctions<Epic<any, any>> {

  private statisticsFactory: StatisticsFactory = new StatisticsFactory();

  constructor(private actions: AppActions, private http: HttpClient) {
    super();
  }

  public getOptionEpics(): Epic<any, any>[] {
    return new RestEpic<Option>(this.http, 'option').toEpics();
  }

  public getCategoryEpics(): Epic<any, any>[] {
    return new RestEpic<Option>(this.http, 'categorie').toEpics();
  }

  public getAppKeepEpics(): Epic<any, any>[] {
    return new RestEpic<AppKeep>(this.http, 'appkeep').toEpics();
  }

  public getUserEpics(): Epic<any, any>[] {
    return new RestEpic<User>(this.http, 'user').toEpics();
  }

  private loadStatistics: Epic<any, Statistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_STATISTICS),
      mergeMap(() => zip(
        this.http.get<any>('/api/appkeeps/statistics'),
        this.http.get<any>('/api/appkeeps/statistics/year')
      ).pipe(
        first(),
        map(statistics => this.actions.loadStatisticsSuccess(this.statisticsFactory.create(statistics)))
      ))
    );
  }

  private loadCategoryStatistics: Epic<any, CategoryStatistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_CATEGORY_STATISTICS),
      mergeMap(action => zip(
        this.http.get<any>(`/api/categories/${action.payload}/appkeeps`),
        this.http.get<any>(`/api/categories/${action.payload}/statistics/year`)
      ).pipe(
        first(),
        map(statistics => this.actions.loadCategoryStatisticsSuccess(this.statisticsFactory.createCategoryStatistics(statistics)))
      ))
    );
  }

  private serverLogin: Epic<any, string> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.SERVER_LOGIN),
      mergeMap(action => this.http.post<string>('/auth', {token: action.payload}).pipe(
        first(),
        map(apiToken => this.actions.serverLoginSuccess(apiToken))
      ))
    );
  }
}
