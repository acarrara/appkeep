import { Action } from '../redux/Action';
import { AppKeep } from './models/AppKeep';
import { Statistics } from './models/Statistics';
import { SocialUser } from 'angularx-social-login';
import { Option } from './models/Option';

export class AppActions {

  public static LOAD_APPKEEPS = 'LOAD_APPKEEPS';
  public static LOAD_STATISTICS = 'LOAD_STATISTICS';
  public static LOAD_STATISTICS_SUCCESS = 'LOAD_STATISTICS_SUCCESS';
  public static ADD_APPKEEP = 'ADD_APPKEEP';
  public static DELETE_APPKEEP = 'DELETE_APPKEEP';
  public static EDIT_APPKEEP = 'EDIT_APPKEEP';
  public static EDIT_OPTION = 'EDIT_OPTION';
  public static LOAD_OPTIONS = 'LOAD_OPTIONS';
  public static LOAD_USERS = 'LOAD_USERS';
  public static ADD_OPTION = 'ADD_OPTION';
  public static LOGIN = 'LOGIN';

  public loadAppKeeps(): Action<any> {
    return {type: AppActions.LOAD_APPKEEPS};
  }

  addAppKeep(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.ADD_APPKEEP, payload: appKeep};
  }

  deleteAppKeep(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.DELETE_APPKEEP, payload: appKeep};
  }

  editAppKeep(appKeep: AppKeep): Action<AppKeep> {
    return {type: AppActions.EDIT_APPKEEP, payload: appKeep};
  }

  loadStatistics(): Action<any> {
    return {type: AppActions.LOAD_STATISTICS};
  }

  loadStatisticsSuccess(statistics: Statistics): Action<Statistics> {
    return {type: AppActions.LOAD_STATISTICS_SUCCESS, payload: statistics};
  }

  login(user: SocialUser): Action<SocialUser> {
    return {type: AppActions.LOGIN, payload: user};
  }

  public loadOptions(): Action<any> {
    return {type: AppActions.LOAD_OPTIONS};
  }

  public loadUsers(): Action<any> {
    return {type: AppActions.LOAD_USERS};
  }

  addOption(option: Option): Action<Option> {
    return {type: AppActions.ADD_OPTION, payload: option};
  }

  editOption(option: Option) {
    return {type: AppActions.EDIT_OPTION, payload: option};
  }
}
