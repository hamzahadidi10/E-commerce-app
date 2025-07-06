import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/enviroment';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';
import { Usermod } from './usermod';
import { UserStateService } from './user-state-service';

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  cin: string;
  phone: string;
  city: string;
  role: string;
  imageUrl?: string;
  date?: string;
  code?: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiServerUrl = environment.apiBaseUrl;
  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenRefreshInProgress = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userState: UserStateService
  ) {
    this.initializeToken();
  }

  private initializeToken(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && !this.isTokenExpired(token)) {
        this.currentTokenSubject.next(token);
      } else {
        this.clearAuthData();
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(
      `${this.apiServerUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => this.handleAuthentication(response.token)),
      map(() => true),
      catchError(error => {
        console.error('Login failed:', error);
        return of(false);
      })
    );
  }

  private handleAuthentication(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    this.currentTokenSubject.next(token);
    this.userState.setActiveUser(this.decodeToken(token));
  }

  private decodeToken(token: string): Usermod {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      cin: decoded.cin || '',
      username: decoded.username,
      email: decoded.email,
      phone: decoded.phone || '',
      city: decoded.city || '',
      role: decoded.role || 'USER',
      imageUrl: decoded.imageUrl || 'assets/default-avatar.png',
      password: '',
      date: decoded.date ? new Date(decoded.date) : new Date(),
      code: decoded.code || ''
    };
  }

  getToken(): string | null {
    return this.currentTokenSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    this.currentTokenSubject.next(null);
    this.userState.clearActiveUser();
  }

  refreshToken(): Observable<string | null> {
    if (this.tokenRefreshInProgress) {
      return this.currentTokenSubject.pipe(
        switchMap(token => of(token))
      );
    }

    this.tokenRefreshInProgress = true;
    const currentToken = this.getToken();

    if (!currentToken) {
      this.tokenRefreshInProgress = false;
      return throwError(() => new Error('No token available'));
    }

    return this.http.post<{ token: string }>(
      `${this.apiServerUrl}/auth/refresh`,
      { token: currentToken }
    ).pipe(
      tap(response => {
        this.handleAuthentication(response.token);
        this.tokenRefreshInProgress = false;
      }),
      map(response => response.token),
      catchError(error => {
        this.tokenRefreshInProgress = false;
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }
}