import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YtmusicService {
  // TODO: Replace with your deployed server URL
  private backendUrl = 'https://tunzo-server.onrender.com'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  searchSongs(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/search`, { params: { q: query } });
  }

  getDownloadLink(videoId: string): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/download`, { params: { videoId } });
  }
}
