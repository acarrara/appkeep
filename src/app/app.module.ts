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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormComponent,
    EmptyStateComponent,
    CardComponent,
    AmountPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('sw-include.js', {enabled: environment.production}),
    RouterModule,
    ReduxModule
  ],
  providers: [AppEpics, AppReducers, AppActions],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: StoreService<AppKeepState>, reducers: AppReducers, epics: AppEpics, actions: AppActions) {
    store.setup({
      reducers: reducers.toArray(),
      epics: epics.toArray(),
      initialState: {
        appKeeps: [],
        statistics: {
          lastMonth: 0,
          thisMonth: 0
        }
      }
    });
    store.dispatch(actions.loadAppKeeps());
    store.dispatch(actions.loadStatistics());
  }
}
