import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Friend, FriendRequest } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private readonly API_URL = `${environment.apiUrl}/api/friends`;

  constructor(private http: HttpClient) {}

  getMyFriends(): Promise<Friend[]> {
    return firstValueFrom(this.http.get<Friend[]>(this.API_URL));
  }

  getPendingRequests(): Promise<FriendRequest[]> {
    return firstValueFrom(this.http.get<FriendRequest[]>(`${this.API_URL}/pending`));
  }

  getSentRequests(): Promise<FriendRequest[]> {
    return firstValueFrom(this.http.get<FriendRequest[]>(`${this.API_URL}/sent`));
  }

  sendRequest(friendId: number): Promise<FriendRequest> {
    return firstValueFrom(
      this.http.post<FriendRequest>(`${this.API_URL}/request/${friendId}`, {})
    );
  }

  acceptRequest(requestId: number): Promise<void> {
    return firstValueFrom(
      this.http.put<void>(`${this.API_URL}/accept/${requestId}`, {})
    );
  }

  rejectRequest(requestId: number): Promise<void> {
    return firstValueFrom(
      this.http.put<void>(`${this.API_URL}/reject/${requestId}`, {})
    );
  }

  removeFriend(friendId: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.API_URL}/remove/${friendId}`)
    );
  }

  cancelRequest(requestId: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.API_URL}/cancel/${requestId}`)
    );
  }
}
