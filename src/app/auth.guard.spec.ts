import {AuthGuard} from './auth.guard';
import {ApiAuthenticationService} from './api-authentication.service';
import {firstValueFrom, of} from 'rxjs';
import {TestBed} from '@angular/core/testing';

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

  it('should return truthy observable when user is logged in', async () => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(true));

    const result = await firstValueFrom(guard.canActivate());

    expect(result).toBeTruthy();
  });

  it('should redirect to login when user is not logged in', async () => {
    vi.spyOn(apiAuth, 'silentSignIn').mockReturnValue(of(false));

    const result = await firstValueFrom(guard.canActivate());

    expect(result).toBeFalsy();
  });
});