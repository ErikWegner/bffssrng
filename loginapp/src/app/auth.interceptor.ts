import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Optional() @Inject(REQUEST) private ssrrequest: Request) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.ssrrequest) {
      const cookieHeadersUnsure = this.ssrrequest.headers['cookie'];
      const cookieHeaders: string[] = Array.isArray(cookieHeadersUnsure)
        ? cookieHeadersUnsure
        : cookieHeadersUnsure
        ? [cookieHeadersUnsure]
        : [];

      return next.handle(
        request.clone({
          headers: request.headers.set('Cookie', cookieHeaders),
        })
      );
    }

    return next.handle(request);
  }
}
