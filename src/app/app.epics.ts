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
import { Details } from './models/Details';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';

@Injectable()
export class AppEpics extends ArrayableFunctions<Epic<any, any>> {

  private statisticsFactory: StatisticsFactory = new StatisticsFactory();

  constructor(private actions: AppActions, private http: HttpClient, private store: StoreService<AppKeepState>) {
    super();
  }

  public getOptionEpics(): Epic<any, any>[] {
    return new RestEpic<Option>(this.http, 'option', this.store, this.actions).toEpics();
  }

  public getCategoryEpics(): Epic<any, any>[] {
    return new RestEpic<Option>(this.http, 'categorie', this.store, this.actions).toEpics();
  }

  public getAppKeepEpics(): Epic<any, any>[] {
    return new RestEpic<AppKeep>(this.http, 'appkeep', this.store, this.actions).toEpics();
  }

  public getMonthlyAppKeepEpics(): Epic<any, any>[] {
    return new RestEpic<AppKeep>(this.http, 'monthlyappkeep', this.store, this.actions).toEpics();
  }

  public getUserEpics(): Epic<any, any>[] {
    return new RestEpic<UserInfo>(this.http, 'user', this.store, this.actions).toEpics();
  }

  private loadMonthStatistics: Epic<any, Details> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_MONTH_STATISTICS),
      mergeMap(action => this.http.get<any>(`/api/appkeeps/statistics/${action.payload.year}/${action.payload.month}`).pipe(
        first(),
        map(statistics =>
          this.actions.loadMonthStatisticsSuccess(this.statisticsFactory.createMonthStatistics(statistics, Number(action.payload.month))))
      ))
    );
  }

  private loadYearStatistics: Epic<any, Details> = actions$ => {
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
               this.http.get<any>(`/api/categories/${action.payload.category}${action.payload.year ? '/' + action.payload.year : ''}${action.payload.month ? '/' + action.payload.month : ''}`),
               this.http.get<any>(`/api/categories/${action.payload.category}/statistics/year${action.payload.year ? '/' + action.payload.year : ''}`),
        this.http.get<any>(`/api/categories/${action.payload.category}/statistics/overall`)
      ).pipe(
        first(),
               map(statistics => this.actions.loadCategoryStatisticsSuccess(this.statisticsFactory.createCategoryStatistics(statistics, action.payload.year, action.payload.month)))
      ))
    );
  }
}
