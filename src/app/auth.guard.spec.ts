import {AuthGuard} from './auth.guard';
import {ApiAuthenticationService} from './api-authentication.service';
import {of} from 'rxjs';
import {TestBed, waitForAsync} from '@angular/core/testing';

describe('AuthGuard', () => {

  const apiAuth = {
    silentSignIn: () => {
    }
  } as ApiAuthenticationService;

  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ApiAuthenticationService, useValue: apiAuth}]
    });
    TestBed.runInInjectionContext(() => {
      guard = new AuthGuard();
    });
  });

  it('should return truthy observable when user is logged in', waitForAsync(() => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(true));

    const authenticated = guard.canActivate();

    authenticated.subscribe(loggedIn => expect(loggedIn).toBeTruthy());
  }));

  it('should redirect to login when user is not logged in', waitForAsync(() => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(false));

    const authenticated = guard.canActivate();

    authenticated.subscribe(loggedIn => {
      expect(loggedIn).toBeFalsy();
    });
  }));
});
