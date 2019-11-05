import { Reducer } from '../redux/Reducer';
import { AppActions } from './app.actions';
import { AppKeepState } from './models/AppKeepState';
import { AppKeep } from './models/AppKeep';
import { ArrayableFunctions } from './ArrayableFunctions';
import { Statistics } from './models/Statistics';

export class AppReducers extends ArrayableFunctions<Reducer<AppKeepState, any>> {

  private loadAppKeeps: Reducer<AppKeepState, AppKeep[]> = (action, oldState) => {
    switch (action.type) {
      case AppActions.LOAD_APPKEEPS_SUCCESS: {
        return {
          ...oldState,
          appKeeps: [...action.payload]
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

  private addAppKeep: Reducer<AppKeepState, AppKeep> = (action, oldState) => {
    switch (action.type) {
      case AppActions.ADD_APPKEEP_SUCCESS: {
        return {
          ...oldState,
          appKeeps: [action.payload, ...oldState.appKeeps]
        };
      }
      default: {
        return oldState;
      }
    }
  }

  private deleteAppKeep: Reducer<AppKeepState, AppKeep> = (action, oldState) => {
    switch (action.type) {
      case AppActions.DELETE_APPKEEP_SUCCESS: {
        return {
          ...oldState,
          appKeeps: oldState.appKeeps.filter(current => current._id !== action.payload._id)
        };
      }
      default: {
        return oldState;
      }
    }
  }

}
