import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CategoryComponent } from './category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { DetailsComponent } from './details/details.component';
import { MonthResolveGuard } from './details/month-resolve.guard';
import { YearResolveGuard } from './details/year-resolve.guard';
import { OverallResolveGuard } from './details/overall-resolve.guard';


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
    path: 'category/:category/:year/:month',
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
    component: DetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      details: MonthResolveGuard
    },
    data: {
      title: 'This month'
    }
  },
  {
    path: 'details/:year/:month',
    component: DetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      details: MonthResolveGuard
    }
  },
  {
    path: 'details/year',
    component: DetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      details: YearResolveGuard
    },
    data: {
      title: 'This year',
      rangesTitle: 'months'
    }
  },
  {
    path: 'details/overall',
    component: DetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      details: OverallResolveGuard
    },
    data: {
      title: 'Overall',
      rangesTitle: 'years'
    }
  },
  {
    path: 'details/:year',
    component: DetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      details: YearResolveGuard
    },
    data: {
      rangesTitle: 'months'
    }
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
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
