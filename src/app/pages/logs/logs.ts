import { Component, inject, signal, computed } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, from, filter, switchMap, map, startWith, catchError, of } from 'rxjs';
import { LogsService, GamesService } from '../../core/services';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { GameLog, Game, User } from '../../interfaces';
import { CoverUrlPipe } from '../../shared/pipes/cover-url.pipe';
import { LogForm } from '../../shared/log-form/log-form';

interface PageState {
  user: User | null;
  logs: GameLog[];
  loading: boolean;
  error: string | null;
}

interface SearchState {
  results: Game[];
  searching: boolean;
}

@Component({
  selector: 'app-logs',
  imports: [RouterLink, FormsModule, DatePipe, AsyncPipe, CoverUrlPipe, LogForm],
  templateUrl: './logs.html',
  styleUrl: './logs.css',
})
export class Logs {
  private route = inject(ActivatedRoute);
  private logsService = inject(LogsService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private gamesService = inject(GamesService);

  // Pure UI state with no async — signals are the right tool here
  showForm = signal(false);
  selectedGame = signal<Game | null>(null);
  gameQuery = signal('');
  private submittedQuery = signal('');

  isOwnPage = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.authService.currentUser()?.id_usuario === id;
  });

  private pageState$ = new BehaviorSubject<PageState>({
    user: null, logs: [], loading: true, error: null,
  });

  pageData$ = this.pageState$.asObservable();

  gameSearch$ = toObservable(this.submittedQuery).pipe(
    filter((q): q is string => !!q),
    switchMap(query =>
      this.gamesService.search(query, 5).pipe(
        map(results => ({ results, searching: false }) as SearchState),
        startWith({ results: [], searching: true } as SearchState),
        catchError(() => of({ results: [], searching: false } as SearchState)),
      )
    ),
    startWith({ results: [], searching: false } as SearchState),
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.pageState$.next({ user: null, logs: [], loading: false, error: 'Invalid user' });
      return;
    }

    const logs$ = this.isOwnPage()
      ? this.logsService.getMyLogs()
      : this.logsService.getUserLogs(id);

    forkJoin({
      user: from(this.userService.getById(id)),
      logs: logs$,
    })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: ({ user, logs }) => {
          this.pageState$.next({ user, logs, loading: false, error: null });
        },
        error: (err) => {
          this.pageState$.next({ user: null, logs: [], loading: false, error: 'Failed to load logs' });
          console.error('Error loading logs:', err);
        },
      });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.selectedGame.set(null);
    this.gameQuery.set('');
    this.submittedQuery.set('');
  }

  searchGames() {
    const query = this.gameQuery().trim();
    if (!query) return;
    this.submittedQuery.set(query);
  }

  selectGame(game: Game) {
    this.selectedGame.set(game);
    this.gameQuery.set('');
  }

  onLogCreated(log: GameLog) {
    log.game = this.selectedGame()!;
    const current = this.pageState$.getValue();
    this.pageState$.next({ ...current, logs: [log, ...current.logs] });
    this.showForm.set(false);
    this.selectedGame.set(null);
  }
}
