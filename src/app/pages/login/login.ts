import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMsg = 'Completa los campos correctamente.';
      return;
    }

    this.errorMsg = '';
    this.loading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        if (err.status === 401) {
          this.errorMsg = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMsg = 'No se ha podido iniciar sesión. Inténtalo más tarde.';
        }
      },
    });
  }
}
