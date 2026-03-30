import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, Genre } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private readonly API_URL = `${environment.apiUrl}/api/games`;

  constructor(private http: HttpClient) {}

  search(query: string, limit: number = 20): Observable<Game[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());
    return this.http.get<Game[]>(`${this.API_URL}/search`, { params });
  }

  getById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.API_URL}/${id}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.API_URL}/genres`);
  }

  getByGenre(genreId: number, limit: number = 20, offset: number = 0): Observable<Game[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    return this.http.get<Game[]>(`${this.API_URL}/genre/${genreId}`, { params });
  }

  getPopular(limit: number = 20): Observable<Game[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Game[]>(`${this.API_URL}/popular`, { params });
  }

  getTrending(limit: number = 20): Observable<Game[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Game[]>(`${this.API_URL}/trending`, { params });
  }

  getUpcoming(limit: number = 20): Observable<Game[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Game[]>(`${this.API_URL}/upcoming`, { params });
  }
}
