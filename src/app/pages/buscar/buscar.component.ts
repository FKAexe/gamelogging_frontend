import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { catchError, of } from 'rxjs';
import { GamesService } from '../../core/services';
import { Genre } from '../../interfaces';
import { GameGrid } from '../../shared/game-grid/game-grid';

@Component({
  selector: 'app-buscar',
  imports: [FormsModule, GameGrid, AsyncPipe],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.css',
})
export class BuscarComponent {
  private gamesService = inject(GamesService);

  searchQuery = signal('');
  selectedGenreId = signal<number | null>(null);
  submittedQuery = signal<string | undefined>(undefined);

  activeMode = computed<'search' | 'genre' | null>(() => {
    if (this.selectedGenreId() !== null) return 'genre';
    if (this.submittedQuery()) return 'search';
    return null;
  });

  genres$ = this.gamesService.getGenres().pipe(
    catchError(() => of([] as Genre[]))
  );

  onSearch() {
    const query = this.searchQuery().trim();
    if (!query) return;
    this.selectedGenreId.set(null);
    this.submittedQuery.set(query);
  }

  onGenreSelect(id: number) {
    this.searchQuery.set('');
    this.submittedQuery.set(undefined);
    this.selectedGenreId.set(id);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedGenreId.set(null);
    this.submittedQuery.set(undefined);
  }
}
