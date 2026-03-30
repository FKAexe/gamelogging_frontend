import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe, AsyncPipe } from '@angular/common';
import { BehaviorSubject, forkJoin, of, switchMap } from 'rxjs';
import { map, startWith, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GamesService } from '../../core/services';
import { Game, GameLog } from '../../interfaces';
import { CoverUrlPipe } from '../../shared/pipes/cover-url.pipe';
import { ReleaseYearPipe } from '../../shared/pipes/release-year.pipe';
import { AuthService } from '../../core/services';
import { LibraryService } from '../../core/services';
import { LogsService } from '../../core/services/logs';
import { LogForm } from '../../shared/log-form/log-form';

interface GameState {
  game: Game | null;
  logs: GameLog[];
  inLibrary: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  game: null, logs: [], inLibrary: false, loading: true, error: null,
};

@Component({
  selector: 'app-game',
  imports: [DecimalPipe, DatePipe, AsyncPipe, CoverUrlPipe, ReleaseYearPipe, LogForm],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private route = inject(ActivatedRoute);
  private gamesService = inject(GamesService);
  private authService = inject(AuthService);
  private libraryService = inject(LibraryService);
  private logsService = inject(LogsService);

  private destroyRef = inject(DestroyRef);
  authenticated = this.authService.isAuthenticated;

  private state$ = new BehaviorSubject<GameState>(initialState);
  gameData$ = this.state$.asObservable();

  constructor() {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => {
        if (!id) return of({ ...initialState, loading: false, error: 'Invalid game ID' });

        const library$ = this.authService.getToken()
          ? this.libraryService.getMyLibrary()
          : of([]);

        return forkJoin({
          game: this.gamesService.getById(id),
          logs: this.logsService.getGameLogs(id),
          library: library$,
        }).pipe(
          map(({ game, logs, library }) => ({
            game,
            logs,
            inLibrary: library.some(item => item.game?.id === id),
            loading: false,
            error: null,
          }) as GameState),
          startWith(initialState),
          catchError(() => of({ ...initialState, loading: false, error: 'Failed to load game' }))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(state => this.state$.next(state));
  }

  addGame() {
    const current = this.state$.getValue();
    if (!current.game) return;

    this.libraryService.addGame({ igdb_game_id: current.game.id }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.state$.next({ ...this.state$.getValue(), inLibrary: true }),
      error: (err) => {
        if (err.status === 409) {
          this.state$.next({ ...this.state$.getValue(), inLibrary: true });
        } else {
          this.state$.next({ ...this.state$.getValue(), error: 'Failed to add game to library' });
        }
      },
    });
  }

  removeGame() {
    const current = this.state$.getValue();
    if (!current.game) return;

    this.libraryService.removeGame(current.game.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.state$.next({ ...this.state$.getValue(), inLibrary: false }),
      error: (err) => {
        const error = err.status === 404
          ? 'This game is not in your library'
          : 'Failed to remove game from library';
        this.state$.next({ ...this.state$.getValue(), error });
      },
    });
  }

  onLogCreated(log: GameLog) {
    const current = this.state$.getValue();
    this.state$.next({ ...current, logs: [log, ...current.logs] });
  }
}
