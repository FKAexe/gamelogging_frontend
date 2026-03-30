import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin, from, of } from 'rxjs';
import { switchMap, map, startWith, catchError, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { LibraryService } from '../../core/services/library';
import { LogsService } from '../../core/services/logs';
import { FriendsService } from '../../core/services/friends';
import { User, LibraryItem, GameLog, Friend } from '../../interfaces';
import { CoverUrlPipe } from '../../shared/pipes/cover-url.pipe';

interface ProfileState {
  user: User | null;
  library: LibraryItem[];
  logs: GameLog[];
  friends: Friend[];
  isOwnProfile: boolean;
  loading: boolean;
  error: string | null;
}

const emptyState: ProfileState = {
  user: null, library: [], logs: [], friends: [],
  isOwnProfile: false, loading: true, error: null,
};

@Component({
  selector: 'app-profile',
  imports: [DatePipe, RouterLink, AsyncPipe, CoverUrlPipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private libraryService = inject(LibraryService);
  private logsService = inject(LogsService);
  private friendsService = inject(FriendsService);

  editing = signal(false);
  editForm = signal({ name: '', bio: '' });
  saving = signal(false);

  profileData$ = this.route.paramMap.pipe(
    map(params => params.get('username')),
    distinctUntilChanged(),
    switchMap(param => {
      if (!param) return this.loadOwnProfile();
      const id = Number(param);
      return isNaN(id) ? this.loadByUsername(param) : this.loadById(id);
    })
  );

  private loadOwnProfile(): Observable<ProfileState> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return of({ ...emptyState, loading: false, error: 'Not authenticated' });
    }

    return forkJoin({
      library: this.libraryService.getMyLibrary(),
      logs: this.logsService.getMyLogs(),
      friends: from(this.friendsService.getMyFriends()),
    }).pipe(
      map(({ library, logs, friends }) => ({
        user: currentUser,
        library,
        logs: logs.slice(0, 5),
        friends,
        isOwnProfile: true,
        loading: false,
        error: null,
      }) as ProfileState),
      startWith({ ...emptyState }),
      catchError(() => of({ ...emptyState, loading: false, error: 'Failed to load profile' }))
    );
  }

  private loadById(id: number): Observable<ProfileState> {
    return this.userService.getById(id).pipe(
      switchMap(user => this.loadUserData(user)),
      startWith({ ...emptyState }),
      catchError(() => of({ ...emptyState, loading: false, error: 'User not found' }))
    );
  }

  private loadByUsername(username: string): Observable<ProfileState> {
    return this.userService.getByUsername(username).pipe(
      switchMap(user => this.loadUserData(user)),
      startWith({ ...emptyState }),
      catchError(() => of({ ...emptyState, loading: false, error: 'User not found' }))
    );
  }

  private loadUserData(user: User): Observable<ProfileState> {
    const currentUser = this.authService.currentUser();
    const isOwn = currentUser?.id_usuario === user.id_usuario;

    const library$ = isOwn
      ? this.libraryService.getMyLibrary()
      : this.libraryService.getUserLibrary(user.id_usuario);
    const logs$ = isOwn
      ? this.logsService.getMyLogs()
      : this.logsService.getUserLogs(user.id_usuario);
    const friends$ = isOwn
      ? from(this.friendsService.getMyFriends())
      : of([] as Friend[]);

    return forkJoin({ library: library$, logs: logs$, friends: friends$ }).pipe(
      map(({ library, logs, friends }) => ({
        user,
        library,
        logs: logs.slice(0, 5),
        friends,
        isOwnProfile: isOwn,
        loading: false,
        error: null,
      }) as ProfileState)
    );
  }

  getAvatarUrl(user: User | null): string {
    return user?.profile_pic
      || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.username || 'U');
  }

  startEditing(user: User) {
    this.editForm.set({ name: user.name ?? '', bio: user.bio ?? '' });
    this.editing.set(true);
  }

  setEditName(name: string) { this.editForm.update(f => ({ ...f, name })); }
  setEditBio(bio: string) { this.editForm.update(f => ({ ...f, bio })); }

  saveProfile(user: User) {
    this.saving.set(true);
    this.userService.update(user.id_usuario, this.editForm()).subscribe({
      next: (updated) => {
        this.authService.updateCurrentUser(updated);
        this.editing.set(false);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
