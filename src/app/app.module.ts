import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
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
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { IconComponent } from './icon/icon.component';
import { MonthCardComponent } from './month-card/month-card.component';
import { LogoComponent } from './logo/logo.component';
import { YearCardComponent } from './year-card/year-card.component';
import { AkMonthNamePipe } from './month-name.pipe';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { NotificationService } from './notification.service';
import { AppkeepsCardComponent } from './appkeeps-card/appkeeps-card.component';
import { CategoryHeaderComponent } from './category-header/category-header.component';

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
    ProfileComponent,
    IconComponent,
    MonthCardComponent,
    LogoComponent,
    YearCardComponent,
    AkMonthNamePipe,
    EditCategoryComponent,
    AppkeepsCardComponent,
    CategoryHeaderComponent
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
    AuthGuard,
    AppEpics,
    AppReducers,
    AppActions,
    NotificationService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: StoreService<AppKeepState>, reducers: AppReducers, epics: AppEpics, actions: AppActions) {
    store.setup({
      reducers: [
        ...reducers.toArray(),
        ...reducers.getAppKeepReducers(),
        ...reducers.getOptionReducers(),
        ...reducers.getCategoryReducers(),
        ...reducers.getUserReducers()
      ],
      epics: [
        ...epics.toArray(),
        ...epics.getOptionEpics(),
        ...epics.getCategoryEpics(),
        ...epics.getAppKeepEpics(),
        ...epics.getUserEpics()],
      initialState: {
        appKeeps: [],
        options: [],
        categories: [],
        statistics: {
          lastMonth: {categories: []},
          thisMonth: {categories: []},
          year: {months: []}
        },
        categoryStatistics: {
          thisMonthAppKeeps: [],
          lastMonthAppKeeps: [],
          year: {months: []}
        },
        user: undefined,
        users: []
      }
    });
    store.dispatch(actions.loadAppKeeps());
    store.dispatch(actions.loadOptions());
    store.dispatch(actions.loadCategories());
    store.dispatch(actions.loadStatistics());
    store.dispatch(actions.loadUsers());
  }
}
