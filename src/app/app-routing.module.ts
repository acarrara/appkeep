import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { EditComponent } from './edit/edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CategoryComponent } from './edit-category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:category',
    component: CategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'monthly/:id',
    component: MonthlyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/month',
    component: MonthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:year/:month',
    component: MonthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/year',
    component: YearComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:year',
    component: YearComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'monthly',
    component: MonthlyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
