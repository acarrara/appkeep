import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AmountPipe } from './amount.pipe';
import { FormComponent } from './form/form.component';
import { EmptyStateComponent } from './card/empty-state.component';
import { CardComponent } from './card/card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppReducers } from './app.reducers';
import { AppEpics } from './app.epics';
import { ReduxModule } from '../redux/redux-module';
import { AppActions } from './app.actions';
import { EditComponent } from './edit/edit.component';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import credentials from '../credentials.json';
import { LoginComponent } from './login/login.component';
import { HomeHeaderComponent } from './profile/home-header.component';
import { AuthGuard } from './auth.guard';
import { IconComponent } from './icon/icon.component';
import { MonthCardComponent } from './month-card/month-card.component';
import { LogoComponent } from './logo/logo.component';
import { RecapCardComponent } from './year-card/recap-card.component';
import { AkMonthNamePipe } from './month-name.pipe';
import { CategoryComponent } from './edit-category/category.component';
import { NotificationService } from './notification.service';
import { AppkeepsCardComponent } from './appkeeps-card/appkeeps-card.component';
import { CategoryHeaderComponent } from './category-header/category-header.component';
import { CategoryHuePipe } from './category-hue.pipe';
import { ProfileComponent } from './profile/profile.component';
import { AuthInterceptor } from './auth-interceptor.service';
import { ApiAuthenticationService } from './api-authentication.service';
import { MonthlyAppkeepsCardComponent } from './monthly-appkeeps-card/monthly-appkeeps-card.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { IncomeIndicatorComponent } from './income-indicator/income-indicator.component';
import { UserHuePipe } from './user-hue.pipe';
import { UserNamePipe } from './user-name.pipe';
import { MonthComponent } from './month/month.component';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(credentials.clientID)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormComponent,
    EmptyStateComponent,
    CardComponent,
    EditComponent,
    AmountPipe,
    LoginComponent,
    HomeHeaderComponent,
    IconComponent,
    MonthCardComponent,
    LogoComponent,
    RecapCardComponent,
    AkMonthNamePipe,
    CategoryComponent,
    AppkeepsCardComponent,
    CategoryHeaderComponent,
    CategoryHuePipe,
    ProfileComponent,
    MonthlyAppkeepsCardComponent,
    MonthlyComponent,
    IncomeIndicatorComponent,
    UserHuePipe,
    UserNamePipe,
    MonthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('sw-include.js', {enabled: environment.production}),
    RouterModule,
    ReduxModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    AppEpics,
    AppReducers,
    AppActions,
    NotificationService,
    ApiAuthenticationService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
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
          thisMonth: {users: [], appKeepCategories: [], incomeCategories: []},
          thisYear: {months: []},
          overall: {years: []}
        },
        categoryStatistics: {
          thisMonthAppKeeps: [],
          thisYear: {months: []},
          overall: {years: []}
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
