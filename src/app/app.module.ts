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
    MonthCardComponent
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
      reducers: [...reducers.toArray(), ...reducers.getAppKeepReducers(), ...reducers.getOptionReducers()],
      epics: [...epics.toArray(), ...epics.getOptionEpics(), ...epics.getAppKeepEpics()],
      initialState: {
        appKeeps: [],
        options: [],
        statistics: {
          lastMonth: {categories: []},
          thisMonth: {categories: []}
        },
        user: undefined
      }
    });
    store.dispatch(actions.loadAppKeeps());
    store.dispatch(actions.loadOptions());
    store.dispatch(actions.loadStatistics());
  }
}
