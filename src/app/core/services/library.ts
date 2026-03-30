import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibraryItem, AddToLibraryRequest } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private readonly API_URL = `${environment.apiUrl}/api/library`;

  constructor(private http: HttpClient) {}

  getMyLibrary(): Observable<LibraryItem[]> {
    return this.http.get<LibraryItem[]>(this.API_URL);
  }

  getUserLibrary(userId: number): Observable<LibraryItem[]> {
    return this.http.get<LibraryItem[]>(`${this.API_URL}/user/${userId}`);
  }

  addGame(data: AddToLibraryRequest): Observable<LibraryItem> {
    return this.http.post<LibraryItem>(this.API_URL, data);
  }

  removeGame(gameId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${gameId}`);
  }
}
