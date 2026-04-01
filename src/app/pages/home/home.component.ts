import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameGrid } from '../../shared/game-grid/game-grid';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-home',
  imports: [GameGrid, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authenticated = inject(AuthService).isAuthenticated;
}
