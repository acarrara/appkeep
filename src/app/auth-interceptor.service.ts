import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ApiAuthenticationService } from './api-authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private apiToken: string;

  constructor(private apiAuth: ApiAuthenticationService) {
    this.apiAuth.apiToken$.subscribe(apiToken => this.apiToken = apiToken);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith('/api')) {
      return next.handle(req);
    }
    return next.handle(req.clone({
      headers: req.headers.set('apiAuthorization', `Bearer ${(this.apiToken)}`)
    }));
  }
}
