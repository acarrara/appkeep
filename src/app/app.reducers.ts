import { Reducer } from '../redux/Reducer';
import { AppActions } from './app.actions';
import { AppKeepState } from './models/AppKeepState';
import { AppKeep } from './models/AppKeep';

export class AppReducers {

  public loadAppKeeps: Reducer<AppKeepState, AppKeep[]> = (action, oldState) => {
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

  public addAppKeep: Reducer<AppKeepState, AppKeep> = (action, oldState) => {
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

  public deleteAppKeep: Reducer<AppKeepState, AppKeep> = (action, oldState) => {
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
