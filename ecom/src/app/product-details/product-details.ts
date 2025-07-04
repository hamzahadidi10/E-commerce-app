import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product';
import { Prod } from '../prod';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserStateService } from '../user-state-service';
import { Usermod } from '../usermod';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
  product$!: Observable<Prod | null>;
  activeUser: Usermod | null = null;
  selectedSize: string | null = null;
  addCartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });

    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.productService.getProductById(id) : of(null);
      })
    );
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.addCartMessage = '';  // Clear any previous message on size select
  }

  addToCart(product: Prod | null) {
    if (!product) return;

    if (!this.selectedSize) {
      this.addCartMessage = 'Please select a size.';
      return;
    }

    const newItem = {
      product,
      size: this.selectedSize,
      quantity: 1
    };

    // Get current cart or empty array
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Check if product with same id and size already exists
    const existingIndex = currentCart.findIndex(
      (item: any) => item.product.id === newItem.product.id && item.size === newItem.size
    );

    if (existingIndex > -1) {
      // If exists, increase quantity
      currentCart[existingIndex].quantity += 1;
    } else {
      // Otherwise add new item
      currentCart.push(newItem);
    }

    // Save updated cart back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(currentCart));

    // Navigate to cart page
    this.router.navigate(['/cart']);
  }
}
