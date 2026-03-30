import { Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import { GameCard } from '../game-card/game-card';
import { GamesService } from '../../core/services';
import { Game } from '../../interfaces';

export type GameGridMode = 'popular' | 'trending' | 'upcoming' | 'genre' | 'search';

interface GamesState {
  games: Game[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-game-grid',
  imports: [GameCard, AsyncPipe],
  templateUrl: './game-grid.html',
  styleUrl: './game-grid.css',
})
export class GameGrid {
  title   = input('');
  mode    = input<GameGridMode>('popular');
  genreId = input<number | undefined>(undefined);
  query   = input<string | undefined>(undefined);
  limit   = input(12);

  private gamesService = inject(GamesService);

  private params = computed(() => ({
    mode:    this.mode(),
    genreId: this.genreId(),
    query:   this.query(),
    limit:   this.limit(),
  }));

  games$ = toObservable(this.params).pipe(
    switchMap(({ mode, genreId, query, limit }) =>
      this.fetchGames(mode, genreId, query, limit).pipe(
        map(games => ({ games, loading: false, error: null }) as GamesState),
        startWith({ games: [], loading: true, error: null } as GamesState),
        catchError(() => of({ games: [], loading: false, error: 'Failed to load games' } as GamesState))
      )
    )
  );

  private fetchGames(mode: GameGridMode, genreId: number | undefined, query: string | undefined, limit: number) {
    switch (mode) {
      case 'trending': return this.gamesService.getTrending(limit);
      case 'upcoming': return this.gamesService.getUpcoming(limit);
      case 'genre':    return this.gamesService.getByGenre(genreId!, limit);
      case 'search':   return this.gamesService.search(query!, limit);
      default:         return this.gamesService.getPopular(limit);
    }
  }
}
