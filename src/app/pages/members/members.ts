import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, forkJoin, from, combineLatest } from 'rxjs';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { FriendsService } from '../../core/services/friends';
import { User, Friend, FriendRequest } from '../../interfaces';

interface MembersState {
  users: User[];
  friends: Friend[];
  sentRequests: FriendRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: MembersState = {
  users: [], friends: [], sentRequests: [], loading: true, error: null,
};

@Component({
  selector: 'app-members',
  imports: [FormsModule, RouterLink, AsyncPipe],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private friendsService = inject(FriendsService);

  searchQuery$ = new BehaviorSubject('');

  private state$ = new BehaviorSubject<MembersState>(initialState);

  filteredMembers$ = combineLatest([this.state$, this.searchQuery$]).pipe(
    map(([state, query]) => {
      const currentUserId = this.authService.currentUser()?.id_usuario;
      const users = state.users.filter(u => u.id_usuario !== currentUserId);
      if (!query.trim()) return users;
      const q = query.trim().toLowerCase();
      return users.filter(u =>
        u.username.toLowerCase().includes(q) ||
        (u.name && u.name.toLowerCase().includes(q))
      );
    })
  );

  constructor() {
    forkJoin({
      users: this.userService.getAll(),
      friends: from(this.friendsService.getMyFriends()),
      sent: from(this.friendsService.getSentRequests()),
    }).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: ({ users, friends, sent }) => {
        this.state$.next({ users, friends, sentRequests: sent, loading: false, error: null });
      },
      error: () => {
        this.state$.next({ ...initialState, loading: false, error: 'Failed to load members' });
      },
    });
  }

  getFriendStatus(user: User): 'friend' | 'pending' | 'none' {
    const { friends, sentRequests } = this.state$.getValue();
    if (friends.some(f => f.id_usuario === user.id_usuario)) {
      return 'friend';
    }
    if (sentRequests.some(r => r.friend_id === user.id_usuario)) {
      return 'pending';
    }
    return 'none';
  }

  sendFriendRequest(userId: number) {
    from(this.friendsService.sendRequest(userId)).subscribe({
      next: (request) => {
        const current = this.state$.getValue();
        this.state$.next({ ...current, sentRequests: [...current.sentRequests, request] });
      },
      error: (err) => console.error('Error sending friend request:', err),
    });
  }

  getAvatarUrl(user: User): string {
    return user.profile_pic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username);
  }

  get loading$() { return this.state$.pipe(map(s => s.loading)); }
  get allUsersCount$() { return this.state$.pipe(map(s => s.users.length)); }
}
