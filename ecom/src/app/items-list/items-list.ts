import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, catchError, startWith, tap } from 'rxjs/operators';

import { Prod } from '../prod';
import { ProductService } from '../product';
import { UserStateService } from '../user-state-service';
import { Usermod } from '../usermod';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsList implements OnInit {
  products$!: Observable<Prod[]>;
  selectedProduct: Prod | null = null;
  activeUser: Usermod | null = null;
  isLoading = false;

  filteredProducts: Prod[] = [];
  private allProducts: Prod[] = [];

  private refreshTrigger$ = new Subject<void>();
  private latestFilters = {
    searchTerm: '',
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 1000
  };

  constructor(
    private productService: ProductService,
    private userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products$ = this.refreshTrigger$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.productService.getProducts().pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Error loading products:', error.message);
            return of([]);
          }),
          tap(products => {
            this.allProducts = products;
            this.applyFilters(this.latestFilters);
          })
        )
      )
    );

    this.products$.subscribe();

    this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

  setSelectedProduct(product: Prod): void {
    this.selectedProduct = product;
  }

  goToUpdate(product: Prod): void {
    this.selectedProduct = product;
    this.router.navigate(['/product-update', product.id]);
  }

  onDelete(): void {
    if (!this.selectedProduct?.id) return;

    this.isLoading = true;

    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.refreshTrigger$.next();

        const modalEl = document.getElementById('deleteModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        this.selectedProduct = null;
      },
      error: err => {
        this.isLoading = false;
        console.error('Error deleting:', err);
      }
    });
  }

  trackByProductId(index: number, item: Prod): string {
    return item.id;
  }

  applyFilters(filters: {
    searchTerm: string;
    categories: string[];
    minPrice: number;
    maxPrice: number;
  }) {
    this.latestFilters = filters;

    if (!this.allProducts.length) return;

    this.filteredProducts = this.allProducts.filter(product => {
      const matchesSearch =
        !filters.searchTerm ||
        product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(product.category);

      const matchesPrice = product.price <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  triggerRefresh(): void {
    this.refreshTrigger$.next();
  }
}
