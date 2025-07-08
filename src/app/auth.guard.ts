import { Injectable, inject } from '@angular/core';
import {Observable} from 'rxjs';
import {ApiAuthenticationService} from './api-authentication.service';

@Injectable()
export class AuthGuard {
  apiAuth = inject(ApiAuthenticationService);

  canActivate(): Observable<boolean> {
    return this.apiAuth.silentSignIn();
  }
}
