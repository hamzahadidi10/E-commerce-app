import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';

import { Usermod } from '../usermod';
import { UserService } from '../user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule , ReactiveFormsModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsers implements OnInit {
  users$: Observable<Usermod[]>;
  filteredUsers$: Observable<Usermod[]>;

  searchControl = new FormControl('');
  
  selectedUser: Usermod | null = null;
  editUser: Usermod = this.getEmptyUser();
  newPassword = '';
  confirmPassword = '';
  isLoading = false;

  constructor(private userService: UserService) {
    this.users$ = this.userService.users$;

    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      ]).pipe(
      map(([users, searchTerm]) => {
        if (!searchTerm) return users;
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.cin.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
        );
      })
    );
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      error: err => console.error('Error loading users:', err)
    });
  }

  async closeModal(id: string): Promise<void> {
    if (typeof document === 'undefined') return;
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    const { Modal } = await import('bootstrap');
    const modalInstance = Modal.getInstance(modalEl) ?? new Modal(modalEl);
    modalInstance.hide();
  }

  setSelectedUser(user: Usermod): void {
    this.selectedUser = { ...user };
    this.editUser = { ...user };
    this.newPassword = '';
    this.confirmPassword = '';
  }

  async openEditModal(user: Usermod) {
    this.setSelectedUser(user);
    const { Modal } = await import('bootstrap');
    const modalEl = document.getElementById('editModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) ?? new Modal(modalEl);
      modalInstance.show();
    }
  }

  async openDeleteModal(user: Usermod) {
    this.setSelectedUser(user);
    const { Modal } = await import('bootstrap');
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) ?? new Modal(modalEl);
      modalInstance.show();
    }
  }

  async onDelete(): Promise<void> {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.userService.deleteUser(this.selectedUser.cin).subscribe({
      next: async () => {
        this.selectedUser = null;
        this.isLoading = false;
        await this.closeModal('deleteModal');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    });
  }

  async onUpdate(): Promise<void> {
    if (!this.editUser || !this.editUser.cin) return;

    if (this.newPassword.trim() || this.confirmPassword.trim()) {
      if (this.newPassword !== this.confirmPassword) {
        alert("New password and confirmation do not match.");
        return;
      }
      this.editUser.password = this.newPassword.trim();
    }

    this.isLoading = true;
    this.userService.updateUser(this.editUser, this.editUser.cin).subscribe({
      next: async () => {
        this.selectedUser = null;
        this.editUser = this.getEmptyUser();
        this.newPassword = '';
        this.confirmPassword = '';
        this.isLoading = false;
        await this.closeModal('editModal');
      },
      error: err => {
        this.isLoading = false;
        console.error('Update error:', err);
        alert('Failed to update user.');
      }
    });
  }

  getEmptyUser(): Usermod {
    return {
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
  }

  trackByCin(index: number, user: Usermod): string {
    return user.cin;
  }
} 
