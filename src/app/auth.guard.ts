import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiAuthenticationService } from './api-authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private apiTokenService: ApiAuthenticationService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.apiTokenService.silentSignIn().pipe(tap(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      }
    }));
  }
}
