import { Reducer } from '../redux/Reducer';
import { AppActions } from './app.actions';
import { AppKeepState } from './models/AppKeepState';
import { ArrayableFunctions } from './ArrayableFunctions';
import { Statistics } from './models/Statistics';
import { AppKeep } from './models/AppKeep';
import { Option } from './models/Option';
import { RestReducer } from './RestReducer';
import { UserInfo } from './models/UserInfo';
import { Category } from './models/Category';
import { CategoryStatistics } from './models/CategoryStatistics';
import { User } from './models/User';
import { Details } from './models/Details';
import { Injectable } from '@angular/core';

@Injectable()
export class AppReducers extends ArrayableFunctions<Reducer<AppKeepState, any>> {

  public getAppKeepReducers(): Reducer<AppKeepState, AppKeep | AppKeep[]>[] {
    return new RestReducer<AppKeep>('appKeep').toReducers();
  }

  public getMonthlyAppKeepReducers(): Reducer<AppKeepState, AppKeep | AppKeep[]>[] {
    return new RestReducer<AppKeep>('monthlyAppKeep').toReducers();
  }

  public getOptionReducers(): Reducer<AppKeepState, Option | Option[]>[] {
    return new RestReducer('option').toReducers();
  }

  public getCategoryReducers(): Reducer<AppKeepState, Category | Category[]>[] {
    return new RestReducer('categorie').toReducers();
  }

  public getUserReducers(): Reducer<AppKeepState, UserInfo | UserInfo[]>[] {
    return new RestReducer('user').toReducers();
  }

  private login: Reducer<AppKeepState, User> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOGIN: {
        return {
          ...oldState,
          user: action.payload
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private loadStatistics: Reducer<AppKeepState, Statistics> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOAD_STATISTICS_SUCCESS: {
        return {
          ...oldState,
          statistics: action.payload
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private loadMonthStatistics: Reducer<AppKeepState, Details> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOAD_MONTH_STATISTICS_SUCCESS: {
        return {
          ...oldState,
          monthStatistics: action.payload
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private loadYearStatistics: Reducer<AppKeepState, Details> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOAD_YEAR_STATISTICS_SUCCESS: {
        return {
          ...oldState,
          yearStatistics: action.payload
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private loadCategoryStatistics: Reducer<AppKeepState, CategoryStatistics> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOAD_CATEGORY_STATISTICS_SUCCESS: {
        return {
          ...oldState,
          categoryStatistics: action.payload
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private editUserImmediately: Reducer<AppKeepState, UserInfo> = (action, oldState) => {
    switch (action.type) {
      case AppActions.EDIT_USER: {
        return {
          ...oldState,
          user: {
            ...oldState.user,
            info: action.payload
          }
        };
      }
      default: {
        return oldState;
      }
    }
  }

}
