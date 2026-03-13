import { AppReducers } from './app.reducers';
import { AppActions } from './app.actions';
import { AppKeepState } from './models/AppKeepState';
import { AppKeep } from './models/AppKeep';

describe('AppReducers', () => {
  let reducers: AppReducers;

  const state: AppKeepState = {
    appKeeps: [],
    monthlyAppKeeps: [],
    options: [],
    categories: [],
    statistics: {
      thisMonth: { users: [], outCategories: [], inCategories: [] },
      thisYear: { ranges: [], users: [], outCategories: [], inCategories: [] },
      overall: { ranges: [], users: [], outCategories: [], inCategories: [] }
    },
    monthStatistics: { users: [], outCategories: [], inCategories: [] },
    yearStatistics: { ranges: [], users: [], outCategories: [], inCategories: [] },
    categoryStatistics: { thisMonthAppKeeps: [], months: [], years: [] },
    user: { social: undefined, info: undefined },
    users: [],
    searchResults: []
  };

  beforeEach(() => {
    reducers = new AppReducers();
  });

  describe('login', () => {
    it('should set user on LOGIN', () => {
      const user = { social: { name: 'John' }, info: { email: 'john@example.com', hue: 1, name: 'John' } } as any;
      const newState = (reducers as any).login({ type: AppActions.LOGIN, payload: user }, state);
      expect(newState.user).toBe(user);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).login({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('loadStatistics', () => {
    it('should set statistics on LOAD_STATISTICS_SUCCESS', () => {
      const statistics = { thisMonth: {}, thisYear: {}, overall: {} } as any;
      const newState = (reducers as any).loadStatistics({ type: AppActions.LOAD_STATISTICS_SUCCESS, payload: statistics }, state);
      expect(newState.statistics).toBe(statistics);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).loadStatistics({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('loadMonthStatistics', () => {
    it('should set monthStatistics on LOAD_MONTH_STATISTICS_SUCCESS', () => {
      const details = { users: [], outCategories: [], inCategories: [] } as any;
      const newState = (reducers as any).loadMonthStatistics({ type: AppActions.LOAD_MONTH_STATISTICS_SUCCESS, payload: details }, state);
      expect(newState.monthStatistics).toBe(details);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).loadMonthStatistics({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('loadYearStatistics', () => {
    it('should set yearStatistics on LOAD_YEAR_STATISTICS_SUCCESS', () => {
      const details = { ranges: [], users: [], outCategories: [], inCategories: [] } as any;
      const newState = (reducers as any).loadYearStatistics({ type: AppActions.LOAD_YEAR_STATISTICS_SUCCESS, payload: details }, state);
      expect(newState.yearStatistics).toBe(details);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).loadYearStatistics({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('loadCategoryStatistics', () => {
    it('should set categoryStatistics on LOAD_CATEGORY_STATISTICS_SUCCESS', () => {
      const categoryStats = { thisMonthAppKeeps: [], months: [], years: [] } as any;
      const newState = (reducers as any).loadCategoryStatistics({ type: AppActions.LOAD_CATEGORY_STATISTICS_SUCCESS, payload: categoryStats }, state);
      expect(newState.categoryStatistics).toBe(categoryStats);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).loadCategoryStatistics({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('editUserImmediately', () => {
    it('should update user info on EDIT_USER', () => {
      const userInfo = { email: 'john@example.com', hue: 2, name: 'John Updated' };
      const stateWithUser = { ...state, user: { social: undefined, info: { email: 'john@example.com', hue: 1, name: 'John' } } };
      const newState = (reducers as any).editUserImmediately({ type: AppActions.EDIT_USER, payload: userInfo }, stateWithUser);
      expect(newState.user.info).toBe(userInfo);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).editUserImmediately({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('searchAppKeeps', () => {
    it('should set searchResults on SEARCH_APPKEEPS_SUCCESS', () => {
      const results = [{ _id: '1', title: 'groceries' }] as any;
      const newState = (reducers as any).searchAppKeeps(
        { type: AppActions.SEARCH_APPKEEPS_SUCCESS, payload: results }, state
      );
      expect(newState.searchResults).toBe(results);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).searchAppKeeps({ type: 'OTHER' }, state)).toBe(state);
    });
  });

  describe('filterNonTodayAppKeepsAfterEdit', () => {
    it('should remove appKeeps not from today on EDIT_APPKEEP_SUCCESS', () => {
      const todayTimestamp = new Date().getTime();
      const pastTimestamp = new Date(2020, 1, 1).getTime();
      const todayAppKeep = { _id: '1', date: todayTimestamp } as AppKeep;
      const pastAppKeep = { _id: '2', date: pastTimestamp } as AppKeep;
      const stateWithAppKeeps = { ...state, appKeeps: [todayAppKeep, pastAppKeep] };

      const newState = (reducers as any).filterNonTodayAppKeepsAfterEdit(
        { type: AppActions.EDIT_APPKEEP + '_SUCCESS' },
        stateWithAppKeeps
      );

      expect(newState.appKeeps).toEqual([todayAppKeep]);
    });

    it('should return old state on unknown action', () => {
      expect((reducers as any).filterNonTodayAppKeepsAfterEdit({ type: 'OTHER' }, state)).toBe(state);
    });
  });
});
