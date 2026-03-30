import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Game } from '../../interfaces';
import { RouterLink } from '@angular/router';
import { CoverUrlPipe } from '../pipes/cover-url.pipe';

@Component({
  selector: 'app-game-card',
  imports: [DecimalPipe, RouterLink, CoverUrlPipe],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  @Input() game: Game | null = null;
}
