import { AuthInterceptor } from './auth-interceptor.service';
import { ApiAuthenticationService } from './api-authentication.service';
import { of } from 'rxjs';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import Spy = jasmine.Spy;

describe('AuthInterceptor', () => {

  const apiAuth = {} as ApiAuthenticationService;
  apiAuth.apiToken$ = of('aToken');
  const authInterceptor = new AuthInterceptor(apiAuth);
  const next = {
    handle: params => {
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
