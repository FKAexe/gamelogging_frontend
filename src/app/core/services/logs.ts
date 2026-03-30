import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameLog, CreateLogRequest, UpdateLogRequest, PendingParticipation } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private readonly API_URL = `${environment.apiUrl}/api/logs`;

  constructor(private http: HttpClient) {}

  getMyLogs(): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(this.API_URL);
  }

  getUserLogs(userId: number): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(`${this.API_URL}/user/${userId}`);
  }

  getGameLogs(gameId: number): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(`${this.API_URL}/game/${gameId}`);
  }

  getPendingParticipations(): Observable<PendingParticipation[]> {
    return this.http.get<PendingParticipation[]>(`${this.API_URL}/pending`);
  }

  create(data: CreateLogRequest): Observable<GameLog> {
    return this.http.post<GameLog>(this.API_URL, data);
  }

  update(id: number, data: UpdateLogRequest): Observable<GameLog> {
    return this.http.put<GameLog>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  acceptParticipation(participantId: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/participant/${participantId}/accept`, {});
  }

  rejectParticipation(participantId: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/participant/${participantId}/reject`, {});
  }
}
