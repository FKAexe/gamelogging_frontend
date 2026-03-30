import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FriendsService } from '../../core/services';
import { FriendRequest, User } from '../../interfaces';

interface RequestsState {
  friendRequests: FriendRequest[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-requests',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class Requests {
  private friendsService = inject(FriendsService);

  private state$ = new BehaviorSubject<RequestsState>({
    friendRequests: [], loading: true, error: null,
  });

  requestsData$ = this.state$.asObservable();

  constructor() {
    from(this.friendsService.getPendingRequests()).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (friendRequests) => this.state$.next({ friendRequests, loading: false, error: null }),
      error: () => this.state$.next({ friendRequests: [], loading: false, error: 'Failed to load requests' }),
    });
  }

  acceptRequest(requestId: number) {
    from(this.friendsService.acceptRequest(requestId)).subscribe({
      next: () => {
        const current = this.state$.getValue();
        this.state$.next({ ...current, friendRequests: current.friendRequests.filter(r => r.id !== requestId) });
      },
      error: (err) => console.error('Error accepting friend request:', err),
    });
  }

  rejectRequest(requestId: number) {
    from(this.friendsService.rejectRequest(requestId)).subscribe({
      next: () => {
        const current = this.state$.getValue();
        this.state$.next({ ...current, friendRequests: current.friendRequests.filter(r => r.id !== requestId) });
      },
      error: (err) => console.error('Error rejecting friend request:', err),
    });
  }

  getAvatarUrl(user?: User): string {
    return user?.profile_pic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.username || 'U');
  }
}
