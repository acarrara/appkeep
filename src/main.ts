import {enableProdMode, importProvidersFrom, inject, isDevMode, provideEnvironmentInitializer} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './app/auth-interceptor.service';
import {AuthGuard} from './app/auth.guard';
import {MonthResolveGuard} from './app/details/month-resolve.guard';
import {YearResolveGuard} from './app/details/year-resolve.guard';
import {OverallResolveGuard} from './app/details/overall-resolve.guard';
import {AppEpics} from './app/app.epics';
import {AppReducers} from './app/app.reducers';
import {AppActions} from './app/app.actions';
import {NotificationService} from './app/notification.service';
import {ApiAuthenticationService} from './app/api-authentication.service';
import {GoogleLoginProvider, SocialAuthServiceConfig} from '@abacritt/angularx-social-login';
import {ReduxModule} from './redux/redux-module';
import {StoreService} from './redux/store.service';
import {provideRouter, withRouterConfig} from '@angular/router';
import {appRoutes} from './app/app-routing.module';
import {provideServiceWorker} from "@angular/service-worker";

if (environment.production) {
  enableProdMode();
}
const clientID = '848348013018-hpu1hsvl233i1bigbb73n2rsnjpk8era.apps.googleusercontent.com';

const authServiceConfig: SocialAuthServiceConfig = {
  providers: [{
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(clientID)
  }
  ]
};

function initStore() {
  const store = inject(StoreService);
  const reducers = inject(AppReducers);
  const epics = inject(AppEpics);

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

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    MonthResolveGuard,
    YearResolveGuard,
    OverallResolveGuard,
    AppEpics,
    AppReducers,
    AppActions,
    NotificationService,
    ApiAuthenticationService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: authServiceConfig
    },
    provideServiceWorker('sw-include.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(ReduxModule),
    provideEnvironmentInitializer(() => {
      initStore();
    })
  ]
})
  .catch(err => console.error(err));
