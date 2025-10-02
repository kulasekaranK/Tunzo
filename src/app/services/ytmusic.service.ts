import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YtmusicService {
  private backendUrl = 'http://localhost:3000'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  searchSongs(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/search`, { params: { q: query } });
  }
}
