import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private authService = inject(AuthService);
  private router = inject(Router);
  logged = this.authService.isAuthenticated();
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
