import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Profile } from './profile/profile';
import { Cart } from './cart/cart';
import { ImageSlider } from './image-slider/image-slider';
import { Shop } from './shop/shop';
import { LogIn } from './log-in/log-in';
import { ManageUsers } from './manage-users/manage-users';
import { ProductDetailsComponent } from './product-details/product-details';
import { Checkout } from './checkout/checkout';
import { ProductUpdate } from './product-update/product-update';
export const routes: Routes = [
  { 
    path: 'landing-page',
    component: LandingPage,
    
  },
   { 
    path: 'profile',
    component: Profile,
    
  },
  { 
    path: 'checkout',
    component: Checkout,
    
  },
  { path: 'product-update/:id', component: ProductUpdate },

  
{
  path: 'product-details/:id',
  loadComponent: () => import('./product-details/product-details').then(m => m.ProductDetailsComponent)
},

  
  { 
    path: 'manage-users',
    component: ManageUsers
  },
  { 
    path: 'log-in',
    component: LogIn
  },
   { 
    path: 'shop',
    component: Shop
  },
   { 
    path: 'cart',
    component: Cart
  },

  { 
    path: '', 
    component: LandingPage,
    pathMatch: 'full' // Default route redirect
  },
  { 
    path: '**', 
    redirectTo: 'landing-page' // Fallback for unknown routes
  }
];
