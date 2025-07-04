import { Component, OnInit } from '@angular/core';
import { ImageSlider } from '../image-slider/image-slider';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Prod } from '../prod';
import { ProductService } from '../product';
import { UserStateService } from '../user-state-service';
import { Usermod } from '../usermod';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ImageSlider, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
  products$!: Observable<Prod[]>; // Declare but don't initialize yet
  activeUser: Usermod | null = null;

  constructor(
    private productService: ProductService,
    private userState: UserStateService
  ) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts().pipe(
      catchError(err => {
        console.error('Error loading products', err);
        return of([]);
      })
    );

    this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });
  }
}
