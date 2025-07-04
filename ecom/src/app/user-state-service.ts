import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usermod } from './usermod';

const ACTIVE_USER_KEY = 'activeUser';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private activeUserSubject = new BehaviorSubject<Usermod | null>(null);
  public activeUser$ = this.activeUserSubject.asObservable();

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(ACTIVE_USER_KEY);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          this.activeUserSubject.next(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user', e);
          localStorage.removeItem(ACTIVE_USER_KEY);
        }
      }
    }
  }

  setActiveUser(user: Usermod): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    }
    this.activeUserSubject.next(user);
  }

  clearActiveUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
    this.activeUserSubject.next(null);
  }

  getActiveUser(): Usermod | null {
    return this.activeUserSubject.value;
  }

  signOut(): void {
    this.clearActiveUser();
  }
}
