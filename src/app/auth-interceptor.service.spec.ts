import {AuthInterceptor} from './auth-interceptor.service';
import {ApiAuthenticationService} from './api-authentication.service';
import {of} from 'rxjs';
import {HttpHandler, HttpRequest} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

describe('AuthInterceptor', () => {

  const apiAuth = {} as ApiAuthenticationService;
  apiAuth.apiToken$ = of('aToken');
  let authInterceptor: AuthInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ApiAuthenticationService, useValue: apiAuth}]
    });
    TestBed.runInInjectionContext(() => {
      authInterceptor = new AuthInterceptor();
    });
  });

  const next = {
    handle: params => { // eslint-disable-line @typescript-eslint/no-unused-vars
    }
  } as HttpHandler;

  it('should leave request as it is when requesting generic resource', () => {
    const request = new HttpRequest<any>('GET', '/generic/resource');
    vi.spyOn(next, 'handle');

    authInterceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalledWith(request);
  });

  it('should add bearer authorization to request when requesting api resource', () => {
    const request = new HttpRequest<any>('GET', '/api/resource');
    const spy = vi.spyOn(next, 'handle');

    authInterceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalled();
    const actualRequest: HttpRequest<any> = spy.mock.calls[0][0];
    expect(actualRequest.headers.get('apiAuthorization')).toEqual('Bearer aToken');
  });
});
