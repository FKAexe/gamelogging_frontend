import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/username/${username}`);
  }

  update(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  uploadAvatar(id: number, file: File): Observable<{ profile_pic: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ profile_pic: string }>(`${this.API_URL}/${id}/avatar`, formData)
    ;
  }
}
