import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Define public endpoints that do NOT require the JWT token
    const isPublicRequest = req.url.includes('/auth/') ||  // login/register
                            req.url.includes('/product/all') ||
                            req.url.includes('/product/find') ||
                            req.url.includes('/user/add');

    // Attach token for all other requests (protected routes)
    if (token && !isPublicRequest) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    // For public requests, just forward the request without modification
    return next.handle(req);
  }
}
