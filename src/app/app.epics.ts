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
import { UserInfo } from './models/UserInfo';
import { zip } from 'rxjs';
import { CategoryStatistics } from './models/CategoryStatistics';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';

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

  public getMonthlyAppKeepEpics(): Epic<any, any>[] {
    return new RestEpic<AppKeep>(this.http, 'monthlyappkeep').toEpics();
  }

  public getUserEpics(): Epic<any, any>[] {
    return new RestEpic<UserInfo>(this.http, 'user').toEpics();
  }

  private loadMonthStatistics: Epic<any, MonthStatistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_MONTH_STATISTICS),
      mergeMap(action => this.http.get<any>(`/api/appkeeps/statistics/${action.payload.year}/${action.payload.month}`).pipe(
        first(),
        map(statistics =>
          this.actions.loadMonthStatisticsSuccess(this.statisticsFactory.createMonthStatistics(statistics, Number(action.payload.month))))
      ))
    );
  }

  private loadYearStatistics: Epic<any, YearStatistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_YEAR_STATISTICS),
      mergeMap(action => this.http.get<any>(`/api/appkeeps/statistics/${action.payload}`).pipe(
        first(),
        map(statistics =>
          this.actions.loadYearStatisticsSuccess(this.statisticsFactory.createYearStatistics(statistics, Number(action.payload))))
      ))
    );
  }

  private loadStatistics: Epic<any, Statistics> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_STATISTICS),
      mergeMap(() => zip(
        this.http.get<any>('/api/appkeeps/statistics/thismonth'),
        this.http.get<any>('/api/appkeeps/statistics/thisyear'),
        this.http.get<any>('/api/appkeeps/statistics/overall')
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
        this.http.get<any>(`/api/categories/${action.payload}/statistics/year`),
        this.http.get<any>(`/api/categories/${action.payload}/statistics/overall`)
      ).pipe(
        first(),
        map(statistics => this.actions.loadCategoryStatisticsSuccess(this.statisticsFactory.createCategoryStatistics(statistics)))
      ))
    );
  }
}
