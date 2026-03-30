import { Component } from '@angular/core';
import { GameGrid } from '../../shared/game-grid/game-grid';

@Component({
  selector: 'app-home',
  imports: [GameGrid],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
