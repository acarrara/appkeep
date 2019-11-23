import { Reducer } from '../redux/Reducer';
import { AppActions } from './app.actions';
import { AppKeepState } from './models/AppKeepState';
import { ArrayableFunctions } from './ArrayableFunctions';
import { Statistics } from './models/Statistics';
import { SocialUser } from 'angularx-social-login';
import { AppKeep } from './models/AppKeep';
import { Option } from './models/Option';
import { RestReducer } from './RestReducer';
import { User } from './models/User';
import { Category } from './models/Category';

export class AppReducers extends ArrayableFunctions<Reducer<AppKeepState, any>> {

  public getAppKeepReducers(): Reducer<AppKeepState, AppKeep | AppKeep[]>[] {
    return new RestReducer<AppKeep>('appKeep').toReducers();
  }

  public getOptionReducers(): Reducer<AppKeepState, Option | Option[]>[] {
    return new RestReducer('option').toReducers();
  }

  public getCategoryReducers(): Reducer<AppKeepState, Category | Category[]>[] {
    return new RestReducer('categorie').toReducers();
  }

  public getUserReducers(): Reducer<AppKeepState, User | User[]>[] {
    return new RestReducer('user').toReducers();
  }

  private login: Reducer<AppKeepState, SocialUser> = (action, oldState) => {
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

}
