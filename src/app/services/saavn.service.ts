import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, getDoc, docData, collectionData, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SaavnApiService {
  private baseUrl = 'https://saavn.dev/api';

  constructor(private http: HttpClient,
    private firestore: Firestore
  ) {}

  // Search songs with custom limit
  searchSongs(query: string, limit: number = 250): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Trending songs
  getTrendingSongs(language: string = 'tamil', limit: number = 250): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/songs?query=hits(${language})&limit=${limit}`);
  }

    // ✅ Get All Documents in a Collection (Real-time)
  getCollectionData(collectionName: string): Observable<any[]> {
    const colRef = collection(this.firestore, collectionName);
    return collectionData(colRef, { idField: 'id' });
  }
}
