import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Prod } from '../prod';
import { ProductService } from '../product';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-update.html',
  styleUrls: ['./product-update.css']
})
export class ProductUpdate implements OnInit {
  productId = '';
  updatedProduct: Partial<Prod> = {};
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.fetchProduct(id);
      } else {
        this.errorMessage = 'No product ID provided.';
      }
    });
  }

  fetchProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: product => {
        this.updatedProduct = { ...product };
      },
      error: err => {
        this.errorMessage = 'Product not found.';
        console.error(err);
      }
    });
  }

  updateProduct(): void {
    if (!this.productId) {
      this.errorMessage = 'No product selected for update.';
      return;
    }

    const updatedPayload: Prod = {
      ...(this.updatedProduct as Prod),
      id: this.productId
    };

    this.isLoading = true;

    this.productService.updateProduct(updatedPayload, this.productId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/shop']); // Redirect to shop page
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = 'Update failed.';
        console.error(err);
      }
    });
  }
}
