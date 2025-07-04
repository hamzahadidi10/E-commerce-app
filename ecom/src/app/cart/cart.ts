import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface CartItem {
  product: {
    id: number; // or string depending on your product ID type
    productName: string;
    price: number;
    productImageUrl: string;
  };
  size: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const state = window.history.state;
      if (state && state.newItem) {
        this.addOrUpdateItem(state.newItem);
      }
      const savedItems = localStorage.getItem('cartItems');
      this.cartItems = savedItems ? JSON.parse(savedItems) : [];
      this.calculateTotal();
    }
  }

  addOrUpdateItem(newItem: CartItem) {
    const index = this.cartItems.findIndex(
      item =>
        item.product.id === newItem.product.id &&
        item.size === newItem.size
    );
    if (index > -1) {
      // Update quantity of existing item
      this.cartItems[index].quantity += newItem.quantity;
    } else {
      // Add new item
      this.cartItems.push(newItem);
    }
    this.saveCart();
  }

  saveCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
    this.calculateTotal();
  }

  updateQuantity(item: CartItem, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (value > 0) {
      item.quantity = value;
      this.saveCart();
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCart();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
  onCheckout() {
  // Clear cart items array
  this.cartItems = [];

  // Clear localStorage cart
  localStorage.removeItem('cartItems');

  // Reset total price
  this.totalPrice = 0;

  // Navigate to checkout page
  this.router.navigate(['/checkout']);
}

}
