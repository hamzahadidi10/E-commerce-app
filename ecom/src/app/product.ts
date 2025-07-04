import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Prod } from './prod';
import { environment } from '../environments/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiServerUrl = environment.apiBaseUrl;

  // 🔁 Refresh stream
  private refreshSubject = new BehaviorSubject<void>(undefined);
  public refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ⏩ Use this to trigger a refresh
  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  // Product requests
  public getProducts(): Observable<Prod[]> {
    return this.http.get<Prod[]>(`${this.apiServerUrl}/product/all`);
  }

  public addProduct(product: Prod): Observable<Prod> {
    return this.http.post<Prod>(`${this.apiServerUrl}/product/add`, product);
  }

  public updateProduct(product: Prod, id: string): Observable<Prod> {
    return this.http.put<Prod>(`${this.apiServerUrl}/product/update/${id}`, product);
  }

  public deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/product/delete/${id}`);
  }
  public getProductById(id: string): Observable<Prod> {
  return this.http.get<Prod>(`${this.apiServerUrl}/product/find/${id}`);
}

}
