import { Injectable } from '@angular/core';
import { environment } from '../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Usermod } from './usermod';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;

  // Store current users in a BehaviorSubject
  private usersSubject = new BehaviorSubject<Usermod[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch and broadcast users; JWT token should be attached by interceptor
  public getUsers(): Observable<Usermod[]> {
    return this.http.get<Usermod[]>(`${this.apiServerUrl}/user/all`).pipe(
      tap(users => this.usersSubject.next(users)) // auto-broadcast
    );
  }

  public addUser(user: Usermod): Observable<Usermod> {
    return this.http.post<Usermod>(`${this.apiServerUrl}/user/add`, user).pipe(
      tap(() => this.refreshUsers())
    );
  }

  public updateUser(user: Usermod, cin: string): Observable<Usermod> {
    return this.http.put<Usermod>(`${this.apiServerUrl}/user/update/${cin}`, user).pipe(
      tap(() => this.refreshUsers())
    );
  }

  public deleteUser(cin: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${cin}`).pipe(
      tap(() => this.refreshUsers())
    );
  }

  // Remove this insecure method — authentication should be done through /auth/login
  // public getUser(email: string, password: string): Observable<Usermod> {
  //   return this.http.get<Usermod>(`${this.apiServerUrl}/user/find/${email}/${password}`);
  // }

  // Helper: refresh user list from backend
  private refreshUsers(): void {
    this.getUsers().subscribe(); // triggers .next(users) in getUsers
  }
}
