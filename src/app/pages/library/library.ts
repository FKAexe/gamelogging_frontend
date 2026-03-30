import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, from, of, throwError } from 'rxjs';
import { map, startWith, catchError } from 'rxjs';
import { AuthService } from '../../core/services/auth';
import { LibraryService } from '../../core/services/library';
import { UserService } from '../../core/services/user';
import { LibraryItem, User } from '../../interfaces';
import { GameCard } from '../../shared/game-card/game-card';

interface PageState {
  user: User | null;
  library: LibraryItem[];
  isOwnLibrary: boolean;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-library',
  imports: [GameCard, AsyncPipe],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private libraryService = inject(LibraryService);
  private userService = inject(UserService);

  pageData$: Observable<PageState>;

  constructor() {
    const userId = this.route.snapshot.paramMap.get('id');

    // Two code paths depending on whether we're viewing our own library or someone else's.
    // Both are shaped into the same { user, library } object so the rest of the pipe is shared.
    const source$: Observable<{ user: User | null; library: LibraryItem[] }> = userId
      ? forkJoin({
          user: from(this.userService.getById(Number(userId))),
          library: this.libraryService.getUserLibrary(Number(userId)),
        })
      : (() => {
          const currentUser = this.authService.currentUser();
          if (!currentUser) return throwError(() => new Error('Not authenticated'));
          return this.libraryService.getMyLibrary().pipe(
            map(library => ({ user: currentUser, library }))
          );
        })();

    this.pageData$ = source$.pipe(
      map(({ user, library }) => ({
        user,
        library,
        isOwnLibrary: this.authService.currentUser()?.id_usuario === user?.id_usuario,
        loading: false,
        error: null,
      } as PageState)),
      startWith({ user: null, library: [], isOwnLibrary: false, loading: true, error: null } as PageState),
      catchError((err) => {
        const message = err?.message === 'Not authenticated' ? 'Not authenticated' : 'Failed to load library';
        return of({ user: null, library: [], isOwnLibrary: false, loading: false, error: message } as PageState);
      })
    );
  }
}
