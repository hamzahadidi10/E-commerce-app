import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth-service';  // Adjust path if needed
import { UserService } from '../user';  // Adjust path if needed
import { Usermod } from '../usermod';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.css'],
})
export class LogIn {
  // Login form fields and state
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  loginFormSubmitted = false;

  // Signup form fields and state
  newuser: Partial<Usermod> = {
    cin: '',
    username: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  };
  passwordConfirm = '';
  signupSuccess = false;
  signupError = '';
  signupFormSubmitted = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // Login method
  login(form: NgForm): void {
    this.loginFormSubmitted = true;
    this.loginError = '';

    if (form.invalid) {
      this.loginError = 'Please fill in all required fields correctly.';
      return;
    }

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.loginFormSubmitted = false;
        this.loginError = '';
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        this.loginError = error.error || 'Invalid email or password.';
      },
    });
  }

  // Signup method
  onSubmit(form: NgForm): void {
    this.signupFormSubmitted = true;
    this.signupSuccess = false;
    this.signupError = '';

    if (form.invalid) {
      this.signupError = 'Please complete all fields correctly.';
      return;
    }

    if (this.newuser.password !== this.passwordConfirm) {
      this.signupError = 'Passwords do not match.';
      return;
    }

    const userToRegister: Usermod = {
      ...this.newuser as Usermod,
      role: 'user',
      date: new Date(),
      code: '',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
    };

    this.userService.addUser(userToRegister).subscribe({
      next: () => {
        this.signupSuccess = true;
        this.signupError = '';
        form.resetForm();
        this.passwordConfirm = '';
        this.signupFormSubmitted = false;
        // Redirect to login page or anywhere after successful signup
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.signupError = error.error || 'Registration failed. Please try again.';
        this.signupSuccess = false;
      },
    });
  }
}
