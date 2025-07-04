import { Component, OnInit } from '@angular/core';
import { Usermod } from '../usermod';
import { UserStateService } from '../user-state-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.html',
  styleUrls: ['./image-slider.css']  // <-- corrected here (styleUrls, plural)
})
export class ImageSlider implements OnInit {
  activeUser: Usermod | null = null;

  constructor(private userState: UserStateService) {}

  ngOnInit() {
    this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });
  }
}
