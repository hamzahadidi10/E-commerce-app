import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserStateService } from '../user-state-service';
import { Usermod } from '../usermod';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule , RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  activeUser: Usermod | null = null;
  constructor( private userState : UserStateService){}
   ngOnInit() {
       this.userState.activeUser$.subscribe(user => {
          this.activeUser = user;
        });
   }
}
