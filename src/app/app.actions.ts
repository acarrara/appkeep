import { Action } from '../redux/Action';
import { AppKeep } from './models/AppKeep';
import { Statistics } from './models/Statistics';

export class AppActions {

  public static LOAD_APPKEEPS = 'LOAD_APPKEEPS';
  public static LOAD_APPKEEPS_SUCCESS = 'LOAD_APPKEEPS_SUCCESS';
  public static LOAD_STATISTICS = 'LOAD_STATISTICS';
  public static LOAD_STATISTICS_SUCCESS = 'LOAD_STATISTICS_SUCCESS';
  public static ADD_APPKEEP = 'ADD_APPKEEP';
  public static ADD_APPKEEP_SUCCESS = 'ADD_APPKEEP_SUCCESS';
  public static DELETE_APPKEEP = 'DELETE_APPKEEP';
  public static DELETE_APPKEEP_SUCCESS = 'DELETE_APPKEEP_SUCCESS';

  public loadAppKeeps(): Action<any> {
    return {type: AppActions.LOAD_APPKEEPS};
  }

  loadAppKeepsSuccess(appKeeps: AppKeep[]): Action<AppKeep[]> {
    return {type: AppActions.LOAD_APPKEEPS_SUCCESS, payload: appKeeps};
  }

  addAppKeep(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.ADD_APPKEEP, payload: appKeep};
  }

  addAppKeepSuccess(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.ADD_APPKEEP_SUCCESS, payload: appKeep};
  }

  deleteAppKeep(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.DELETE_APPKEEP, payload: appKeep};
  }

  deleteAppKeepSuccess(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.DELETE_APPKEEP_SUCCESS, payload: appKeep};
  }

  loadStatistics(): Action<any> {
    return {type: AppActions.LOAD_STATISTICS};
  }

  loadStatisticsSuccess(statistics: Statistics): Action<Statistics> {
    return {type: AppActions.LOAD_STATISTICS_SUCCESS, payload: statistics};
  }
}
