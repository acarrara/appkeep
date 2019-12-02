import { Action } from '../redux/Action';
import { AppKeep } from './models/AppKeep';
import { Statistics } from './models/Statistics';
import { SocialUser } from 'angularx-social-login';
import { Option } from './models/Option';
import { Category } from './models/Category';
import { CategoryStatistics } from './models/CategoryStatistics';
import { User } from './models/User';

export class AppActions {

  public static LOAD_APPKEEPS = 'LOAD_APPKEEPS';
  public static LOAD_MONTHLYAPPKEEPS = 'LOAD_MONTHLYAPPKEEPS';
  public static ADD_APPKEEP = 'ADD_APPKEEP';
  public static EDIT_APPKEEP = 'EDIT_APPKEEP';
  public static DELETE_APPKEEP = 'DELETE_APPKEEP';
  public static LOAD_STATISTICS = 'LOAD_STATISTICS';
  public static LOAD_STATISTICS_SUCCESS = 'LOAD_STATISTICS_SUCCESS';
  public static LOAD_CATEGORY_STATISTICS = 'LOAD_CATEGORY_STATISTICS';
  public static LOAD_CATEGORY_STATISTICS_SUCCESS = 'LOAD_CATEGORY_STATISTICS_SUCCESS';
  public static LOAD_OPTIONS = 'LOAD_OPTIONS';
  public static ADD_OPTION = 'ADD_OPTION';
  public static EDIT_OPTION = 'EDIT_OPTION';
  public static LOAD_CATEGORIES = 'LOAD_CATEGORIES';
  public static ADD_CATEGORY = 'ADD_CATEGORIE';
  public static EDIT_CATEGORY = 'EDIT_CATEGORIE';
  public static LOAD_USERS = 'LOAD_USERS';
  public static ADD_USER = 'ADD_USER';
  public static DELETE_USER = 'DELETE_USER';
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

  loadCategoryStatistics(category: string): Action<any> {
    return {type: AppActions.LOAD_CATEGORY_STATISTICS, payload: category};
  }

  loadCategoryStatisticsSuccess(categoryStatistics: CategoryStatistics): Action<CategoryStatistics> {
    return {type: AppActions.LOAD_CATEGORY_STATISTICS_SUCCESS, payload: categoryStatistics};
  }

  login(user: SocialUser): Action<SocialUser> {
    return {type: AppActions.LOGIN, payload: user};
  }

  public loadOptions(): Action<any> {
    return {type: AppActions.LOAD_OPTIONS};
  }

  addOption(option: Option): Action<Option> {
    return {type: AppActions.ADD_OPTION, payload: option};
  }

  editOption(option: Option) {
    return {type: AppActions.EDIT_OPTION, payload: option};
  }

  public loadCategories(): Action<any> {
    return {type: AppActions.LOAD_CATEGORIES};
  }

  addCategory(category: Category): Action<Category> {
    return {type: AppActions.ADD_CATEGORY, payload: category};
  }

  editCategory(category: Category) {
    return {type: AppActions.EDIT_CATEGORY, payload: category};
  }

  public loadUsers(): Action<any> {
    return {type: AppActions.LOAD_USERS};
  }

  addUser(user: User) {
    return {type: AppActions.ADD_USER, payload: user};
  }

  deleteUser(user: User) {
    return {type: AppActions.DELETE_USER, payload: user};
  }

  loadMonthlyAppKeeps() {
    return {type: AppActions.LOAD_MONTHLYAPPKEEPS};
  }
}
