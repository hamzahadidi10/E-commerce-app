import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
   constructor(private router: Router) {}

  goToShop() {
    this.router.navigate(['/shop']);
  }
}
