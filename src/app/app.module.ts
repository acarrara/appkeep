import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouterModule} from '@angular/router';
import {StoreService} from '../redux/store.service';
import {AppKeepState} from './models/AppKeepState';
import {AppReducers} from './app.reducers';
import {AppEpics} from './app.epics';
import {ReduxModule} from '../redux/redux-module';
import {SocialLoginModule} from '@abacritt/angularx-social-login';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('sw-include.js', {enabled: environment.production}),
    RouterModule,
    ReduxModule,
    SocialLoginModule
  ]
})
export class AppModule {
  constructor(store: StoreService<AppKeepState>, reducers: AppReducers, epics: AppEpics) {
    store.setup({
      reducers: [
        ...reducers.toArray(),
        ...reducers.getAppKeepReducers(),
        ...reducers.getMonthlyAppKeepReducers(),
        ...reducers.getOptionReducers(),
        ...reducers.getCategoryReducers(),
        ...reducers.getUserReducers()
      ],
      epics: [
        ...epics.toArray(),
        ...epics.getOptionEpics(),
        ...epics.getCategoryEpics(),
        ...epics.getAppKeepEpics(),
        ...epics.getMonthlyAppKeepEpics(),
        ...epics.getUserEpics()],
      initialState: {
        appKeeps: [],
        monthlyAppKeeps: [],
        options: [],
        categories: [],
        statistics: {
          thisMonth: {users: [], outCategories: [], inCategories: []},
          thisYear: {ranges: [], users: [], outCategories: [], inCategories: []},
          overall: {ranges: [], users: [], outCategories: [], inCategories: []}
        },
        monthStatistics: {
          users: [],
          outCategories: [],
          inCategories: []
        },
        yearStatistics: {ranges: [], users: [], outCategories: [], inCategories: []},
        categoryStatistics: {
          thisMonthAppKeeps: [],
          months: [],
          years: []
        },
        user: {
          social: undefined,
          info: undefined
        },
        users: []
      }
    });
  }
}
