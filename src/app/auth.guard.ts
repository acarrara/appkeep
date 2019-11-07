import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'angularx-social-login';
import { map, tap } from 'rxjs/operators';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router,
              private store: StoreService<AppKeepState>,
              private actions: AppActions) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.authState.pipe(
      tap(user => {
        if (user !== null) {
          this.store.dispatch(this.actions.login(user));
        } else {
          this.router.navigate(['/login']);
        }
      }),
      map(user => user !== null));
  }
}
