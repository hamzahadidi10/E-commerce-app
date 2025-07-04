import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsList } from '../items-list/items-list';
import { Usermod } from '../usermod';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../user-state-service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Prod } from '../prod';
import { ProductService } from '../product';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ItemsList, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {
  @ViewChild(ItemsList) itemsListComponent!: ItemsList;

  activeUser: Usermod | null = null;
  newProduct = {
    productName: '',
    category: '',
    description: '',
    price: 0,
    productImageUrl: '',
    stock: 0,
    status: ''
  };
  imagePreview: string | null = null;
  isImageValid = false;
  fileError = false;

  filterForm!: FormGroup;
  categories = ['Jeans', 'Hoodies', 'T-shirts', 'Shoes', 'Cargo Pants'];
  maxPrice = 1000; // max allowed price for filter

  constructor(
    private userState: UserStateService,
    private http: HttpClient,
    private productService: ProductService,
    private route: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeFilterForm();

    this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });

    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Optional reload logic here
    });
  }

  initializeFilterForm() {
    const categoryControls = this.categories.reduce((acc: any, category) => {
      acc[category] = new FormControl(false);
      return acc;
    }, {});

    this.filterForm = this.fb.group({
      search: new FormControl(''),
      categories: this.fb.group(categoryControls),
      maxPrice: new FormControl(this.maxPrice)
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(filters => {
      this.applyFilters(filters);
    });
  }

  applyFilters(filters: any) {
    const selectedCategories = Object.entries(filters.categories)
      .filter(([_, isChecked]) => isChecked)
      .map(([category]) => category);

    const maxPrice = filters.maxPrice ?? this.maxPrice;

    if (this.itemsListComponent) {
      this.itemsListComponent.applyFilters({
        searchTerm: filters.search,
        categories: selectedCategories,
        minPrice: 0,
        maxPrice
      });
    }
  }

  previewImage() {
    if (!this.newProduct.productImageUrl) return;
    this.imagePreview = this.newProduct.productImageUrl;
    this.validateImage();
  }

  validateImage() {
    const img = new Image();
    img.onload = () => this.isImageValid = true;
    img.onerror = () => this.isImageValid = false;
    img.src = this.newProduct.productImageUrl;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const productToRegister: Prod = {
      ...this.newProduct as Prod,
    };

    this.productService.addProduct(productToRegister).subscribe({
      next: (response) => {
        this.productService.triggerRefresh();
        this.itemsListComponent.triggerRefresh();
        form.resetForm();
        this.imagePreview = null;
        this.isImageValid = false;

        const modalElement = document.getElementById('addProductModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }
}
