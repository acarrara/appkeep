import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ApiAuthenticationService } from './api-authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private apiTokenService: ApiAuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith('/api')) {
      return next.handle(req);
    }
    // Get the auth token from the service.
    const apiToken = this.apiTokenService.apiToken;

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('apiAuthorization', `Bearer ${apiToken}`)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
