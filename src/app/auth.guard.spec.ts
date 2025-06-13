import { AuthGuard } from './auth.guard';
import { ApiAuthenticationService } from './api-authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';

describe('AuthGuard', () => {

  const apiAuth = {
    silentSignIn: () => {
    }
  } as ApiAuthenticationService;
  const router = {
    navigate: params => {
    }
  } as Router;
  const guard = new AuthGuard(apiAuth, router);

  it('should return truthy observable when user is logged in', waitForAsync(() => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(true));

    const authenticated = guard.canActivate(null, null);

    authenticated.subscribe(loggedIn => expect(loggedIn).toBeTruthy());
  }));

  it('should redirect to login when user is not logged in', waitForAsync(() => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(false));
    vi.spyOn(router, 'navigate');

    const authenticated = guard.canActivate(null, null);

    authenticated.subscribe(loggedIn => {
      expect(loggedIn).toBeFalsy();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  }));
});
