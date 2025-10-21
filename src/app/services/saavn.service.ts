import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  docData,
  collectionData,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private dbInitialized = false;

  private likedSongsSubject = new BehaviorSubject<any[]>([]);
  likedSongs$ = this.likedSongsSubject.asObservable();

  private likedVideosSubject = new BehaviorSubject<any[]>([]);
  likedVideos$ = this.likedVideosSubject.asObservable();

  private playlistsSubject = new BehaviorSubject<any[]>([]);
  playlists$ = this.playlistsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  /** ✅ Initialize local SQLite DB if not yet created */
  async initDB(): Promise<void> {
    if (this.dbInitialized) return;

    // 🔹 Ensure consistency before creating new connection
    await this.sqlite.checkConnectionsConsistency();

    // 🔹 Create or retrieve connection
    this.db = await this.sqlite.createConnection('tunzo', false, 'no-encryption', 1, false);
    await this.db.open();

    // 🔹 Create tables if not exists
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS liked_songs (
        id TEXT PRIMARY KEY,
        song TEXT
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS liked_videos (
        id TEXT PRIMARY KEY,
        video TEXT
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS quality (
        id TEXT PRIMARY KEY,
        value INTEGER,
        label TEXT
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id INTEGER,
        song TEXT,
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
      );
    `);

    this.dbInitialized = true;
    await this.updateLikedSongsStream();
    await this.updateLikedVideosStream();
    await this.updatePlaylistsStream();
  }

  private async updateLikedSongsStream() {
    const likedSongs = await this.getLikedSongsFromDb();
    this.likedSongsSubject.next(likedSongs);
  }

  private async updateLikedVideosStream() {
    const likedVideos = await this.getLikedVideosFromDb();
    this.likedVideosSubject.next(likedVideos);
  }

  private async updatePlaylistsStream() {
    const playlists = await this.getPlaylists();
    this.playlistsSubject.next(playlists);
  }

  // ============================================================
  // 🔹 Data Migration
  // ============================================================
  async migrateLikesFromFirestore(): Promise<void> {
    console.log('Starting Firestore to SQLite migration...');
    await this.initDB(); // Ensure DB is ready

    // 1. Fetch all songs from Firestore
    const colRef = collection(this.firestore, 'likedSongs');
    const q = query(colRef);
    const querySnapshot = await getDocs(q);
    const firestoreSongs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    console.log(`Found ${firestoreSongs.length} songs in Firestore.`);
    if (firestoreSongs.length === 0) {
      console.log('No songs to migrate.');
      return;
    }

    // 2. Insert songs into SQLite in a transaction for performance
    await this.db.run('BEGIN TRANSACTION;');
    try {
      for (const song of firestoreSongs) {
        const createdAt = song.createdAt?.toDate ? song.createdAt.toDate().toISOString() : new Date().toISOString();
        const songData = { ...song, createdAt };
        const songStr = JSON.stringify(songData);

        // Using INSERT OR IGNORE to avoid errors on duplicates
        await this.db.run(
          'INSERT OR IGNORE INTO liked_songs (id, song) VALUES (?, ?)',
          [song.id, songStr]
        );
      }
      await this.db.run('COMMIT TRANSACTION;');
      console.log('Successfully inserted songs into SQLite.');
    } catch (err) {
      await this.db.run('ROLLBACK TRANSACTION;');
      console.error('Error during migration transaction, rolling back.', err);
      throw err;
    }

    // 3. After all songs are inserted, update the reactive stream once.
    await this.updateLikedSongsStream();
    console.log('Migration completed and liked songs stream updated.');
  }


  // ============================================================
  // 🔹 Hybrid Data Access Layer
  // ============================================================

  /** ✅ Get All Documents (real-time if Firestore, local if likedSongs) */
  getCollectionData(collectionName: string): Observable<any[]> {
    if (collectionName === 'likedSongs') {
      return this.likedSongs$;
    }
    if (collectionName === 'likedVideos') {
      return this.likedVideos$;
    }
    if (collectionName === 'playlists') {
      return this.playlists$;
    }

    const colRef = collection(this.firestore, collectionName);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' });
  }

  /** ✅ Fetch all liked songs from SQLite */
  async getLikedSongsFromDb(): Promise<any[]> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM liked_songs');
    const values = result.values ?? [];

    return values.map((row: any) => {
      try {
        return JSON.parse(row.song);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  /** ✅ Fetch all liked videos from SQLite */
  async getLikedVideosFromDb(): Promise<any[]> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM liked_videos');
    const values = result.values ?? [];

    return values.map((row: any) => {
      try {
        return JSON.parse(row.video);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  /** ✅ Create a new playlist */
  async createPlaylist(name: string, description: string): Promise<void> {
    await this.initDB();
    const createdAt = new Date().toISOString();
    await this.db.run(
      'INSERT INTO playlists (name, description, createdAt) VALUES (?, ?, ?)',
      [name, description, createdAt]
    );
    await this.updatePlaylistsStream();
  }

  /** ✅ Fetch all playlists from SQLite */
  async getPlaylists(): Promise<any[]> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM playlists ORDER BY createdAt DESC');
    return result.values ?? [];
  }

  /** ✅ Add a song to a playlist */
  async addSongToPlaylist(playlistId: number, song: any): Promise<void> {
    await this.initDB();
    const songStr = JSON.stringify(song);
    await this.db.run(
      'INSERT INTO playlist_songs (playlist_id, song) VALUES (?, ?)',
      [playlistId, songStr]
    );
  }

  /** ✅ Check if a song is liked (exists in local DB) */
  async isSongLiked(songId: string): Promise<boolean> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM liked_songs WHERE id = ?', [songId]);
    return (result.values ?? []).length > 0;
  }

  /** ✅ Like a song (insert into local DB) */
  async likeSong(song: any): Promise<void> {
    await this.initDB();

    const songWithTimestamp = {
      ...song,
      createdAt: new Date().toISOString(),
    };

    const songStr = JSON.stringify(songWithTimestamp);

    await this.db.run(
      'INSERT OR IGNORE INTO liked_songs (id, song) VALUES (?, ?)',
      [song.id, songStr]
    );
    await this.updateLikedSongsStream();
  }

  /** ✅ Like a video (insert into local DB) */
  async likeVideo(video: any): Promise<void> {
    await this.initDB();

    const videoWithTimestamp = {
      ...video,
      createdAt: new Date().toISOString(),
    };

    const videoStr = JSON.stringify(videoWithTimestamp);

    await this.db.run(
      'INSERT OR IGNORE INTO liked_videos (id, video) VALUES (?, ?)',
      [video.id, videoStr]
    );
    await this.updateLikedVideosStream();
  }

  /** ✅ Unlike a song (remove from local DB) */
  async unlikeSong(songId: string): Promise<void> {
    await this.initDB();
    await this.db.run('DELETE FROM liked_songs WHERE id = ?', [songId]);
    await this.updateLikedSongsStream();
  }

  /** ✅ Unlike a video (remove from local DB) */
  async unlikeVideo(videoId: string): Promise<void> {
    await this.initDB();
    await this.db.run('DELETE FROM liked_videos WHERE id = ?', [videoId]);
    await this.updateLikedVideosStream();
  }

  /** ✅ Save selected quality locally */
  async saveQuality(value: number, label: string): Promise<void> {
    await this.initDB();
    await this.db.run(
      'INSERT OR REPLACE INTO quality (id, value, label) VALUES (?, ?, ?)',
      ['selected', value, label]
    );
  }

  /** ✅ Get selected quality from local DB */
  async getQuality(): Promise<{ value: number; label: string } | null> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM quality WHERE id = ?', ['selected']);
    const values = result.values ?? [];

    if (values.length > 0) {
      const row = values[0];
      return {
        value: row.value,
        label: row.label,
      };
    }

    return null;
  }

  /** ✅ Get a single playlist by its ID */
  async getPlaylistById(id: number): Promise<any | null> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM playlists WHERE id = ?', [id]);
    const values = result.values ?? [];
    return values.length > 0 ? values[0] : null;
  }

  /** ✅ Get all songs for a specific playlist */
  async getSongsForPlaylist(playlistId: number): Promise<any[]> {
    await this.initDB();
    const result = await this.db.query('SELECT * FROM playlist_songs WHERE playlist_id = ?', [playlistId]);
    const values = result.values ?? [];

    return values.map((row: any) => {
      try {
        return JSON.parse(row.song);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  /** ✅ Delete a playlist and its songs */
  async deletePlaylist(playlistId: number): Promise<void> {
    await this.initDB();
    // First, delete all songs associated with the playlist
    await this.db.run('DELETE FROM playlist_songs WHERE playlist_id = ?', [playlistId]);
    // Then, delete the playlist itself
    await this.db.run('DELETE FROM playlists WHERE id = ?', [playlistId]);
    // Update the playlists stream
    await this.updatePlaylistsStream();
  }

  // ============================================================
  // 🔹 Firestore Fallback / Non-migrated APIs
  // ============================================================

  /** ✅ Add Document to Firestore */
  addDocument(collectionName: string, data: any) {
    const colRef = collection(this.firestore, collectionName);
    return addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  /** ✅ Update Document in Firestore */
  updateDocument(path: string, updatedData: any) {
    const docRef = doc(this.firestore, path);
    return updateDoc(docRef, updatedData);
  }

  /** ✅ Delete Document from Firestore */
  deleteDocument(collectionName: string, docId: string) {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return deleteDoc(docRef);
  }

  /** ✅ Get Single Document Data (real-time) */
  getDocumentData(path: string): Observable<any> {
    const docRef = doc(this.firestore, path);
    return docData(docRef, { idField: 'id' });
  }
}
