import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AmountPipe } from './pipes/amount.pipe';
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
import { LoginComponent } from './login/login.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { AuthGuard } from './auth.guard';
import { IconComponent } from './icon/icon.component';
import { CategoriesCardComponent } from './categories-card/categories-card.component';
import { RecapCardComponent } from './recap-card/recap-card.component';
import { MonthNamePipePipe } from './pipes/month-name.pipe';
import { CategoryComponent } from './category/category.component';
import { NotificationService } from './notification.service';
import { AppkeepsCardComponent } from './appkeeps-card/appkeeps-card.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { CategoryHuePipe } from './pipes/category-hue.pipe';
import { ProfileComponent } from './profile/profile.component';
import { AuthInterceptor } from './auth-interceptor.service';
import { ApiAuthenticationService } from './api-authentication.service';
import { MonthlyAppkeepsCardComponent } from './monthly-appkeeps-card/monthly-appkeeps-card.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { IncomeIndicatorComponent } from './income-indicator/income-indicator.component';
import { UserHuePipe } from './pipes/user-hue.pipe';
import { UserNamePipe } from './pipes/user-name.pipe';
import { DetailsComponent } from './details/details.component';
import { MonthResolveGuard } from './details/month-resolve.guard';
import { YearResolveGuard } from './details/year-resolve.guard';
import { OverallResolveGuard } from './details/overall-resolve.guard';
import { InputErrorComponent } from './input-error/input-error.component';
import { FocusOnErrorDirective } from './focus-on-error.directive';
import { CategoryRecapCardComponent } from './category-recap-card/category-recap-card.component';

const clientID = '848348013018-hpu1hsvl233i1bigbb73n2rsnjpk8era.apps.googleusercontent.com';

const authServiceConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(clientID)
  }
]);

export function provideConfig() {
  return authServiceConfig;
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
    CategoriesCardComponent,
    RecapCardComponent,
    MonthNamePipePipe,
    CategoryComponent,
    CategoryRecapCardComponent,
    AppkeepsCardComponent,
    NavigationHeaderComponent,
    CategoryHuePipe,
    ProfileComponent,
    MonthlyAppkeepsCardComponent,
    MonthlyComponent,
    IncomeIndicatorComponent,
    UserHuePipe,
    UserNamePipe,
    DetailsComponent,
    InputErrorComponent,
    FocusOnErrorDirective
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
    MonthResolveGuard,
    YearResolveGuard,
    OverallResolveGuard,
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
