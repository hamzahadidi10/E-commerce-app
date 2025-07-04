import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { UserStateService } from '../user-state-service';
import { UserService } from '../user';
import { Usermod } from '../usermod';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit, OnDestroy {
  activeUser: Usermod | null = null;
  selectedUser: Usermod | null = null;
  isLoading = false;

  editUser: Usermod = {
    cin: '',
    username: '',
    role: '',
    email: '',
    phone: '',
    date: new Date(),
    code: '',
    city: '',
    password: '',
    imageUrl: ''
  };

  newPassword: string = '';
  confirmPassword: string = '';

  private activeUserSub?: Subscription;

  constructor(
    public userState: UserStateService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Subscribe to activeUser$ observable to get real-time updates
    this.activeUserSub = this.userState.activeUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

  ngOnDestroy() {
    // Clean up subscription to avoid memory leaks
    this.activeUserSub?.unsubscribe();
  }

  signOut() {
    this.userState.signOut();
  }

  goToLogin() {
    this.router.navigate(['/log-in']);
  }

  setSelectedUser(user: Usermod) {
    if (!user) {
      console.error('Invalid user provided');
      return;
    }
    this.selectedUser = { ...user };
    this.editUser = { ...user };
    this.newPassword = '';
    this.confirmPassword = '';
  }

  onUpdate() {
    if (!this.editUser || !this.editUser.cin) return;

    if (this.newPassword.trim() || this.confirmPassword.trim()) {
      if (this.newPassword !== this.confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }
      this.editUser.password = this.newPassword.trim();
    }

    this.isLoading = true;

    this.userService.updateUser(this.editUser, this.editUser.cin).subscribe({
      next: (updatedUser: Usermod) => {
        // Update the active user in the state service
        this.userState.setActiveUser(updatedUser);

        // Also update local activeUser for immediate UI update (optional)
        this.activeUser = updatedUser;

        // Reset form
        this.selectedUser = null;
        this.editUser = {
          cin: '',
          username: '',
          role: '',
          email: '',
          phone: '',
          date: new Date(),
          code: '',
          city: '',
          password: '',
          imageUrl: ''
        };
        this.newPassword = '';
        this.confirmPassword = '';

        // Close modal
        document.getElementById('closeEditModal')?.click();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to update user.');
        console.error(err);
      }
    });
  }
}
