import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMsg = 'Please fill all fields correctly.';
      return;
    }

    const { username, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    this.errorMsg = '';
    this.loading = true;

    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Register error:', err);
        if (err.status === 409) {
          this.errorMsg = 'Email or username already exists.';
        } else {
          this.errorMsg = 'Registration failed. Please try again later.';
        }
      },
    });
  }
}
