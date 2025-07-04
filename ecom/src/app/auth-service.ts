import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/enviroment';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // ✅ FIX: use default import

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
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private userState: UserStateService
  ) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(
      `${this.apiServerUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => this.storeTokenAndUser(response.token)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  private storeTokenAndUser(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

    const decoded = jwtDecode<JwtPayload>(token);

    const user: Usermod = {
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

    this.userState.setActiveUser(user);
  }

  getCompleteProfile(): Observable<Usermod> {
    return this.http.get<Usermod>(`${this.apiServerUrl}/user/profile`).pipe(
      tap(user => this.userState.setActiveUser(user))
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.userState.clearActiveUser();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
