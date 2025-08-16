import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio: HTMLAudioElement;
  private playlist: any[] = [];
  private currentIndex = 0;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';

    // Auto play next track
    this.audio.addEventListener('ended', () => this.next());
  }

  setPlaylist(songs: any[], startIndex: number = 0) {
    this.playlist = songs || [];
    this.currentIndex = Math.max(0, Math.min(startIndex, this.playlist.length - 1));
  }

  /** Helper: Saavn objects sometimes have `downloadUrl[].url` or `downloadUrl[].link` */
  private resolveStreamUrl(item: any): string | null {
    const arr = item?.downloadUrl || item?.download_url || [];
    if (!Array.isArray(arr) || arr.length === 0) return null;

    // Prefer 320 kbps if present
    const byQuality = (q: string) => arr.find((d: any) => (d.quality || '').toString().includes(q));
    const pick = byQuality('320') || byQuality('160') || arr[arr.length - 1];
    return pick?.url || pick?.link || null;
  }

  /** Load & play the given index (must be called from a user gesture the first time) */
  async playSong(index: number): Promise<void> {
    if (!this.playlist?.[index]) return Promise.reject('Index out of range');

    this.currentIndex = index;
    const url = this.resolveStreamUrl(this.playlist[index]);
    if (!url) return Promise.reject('No stream URL');

    // Stop current, load new
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = url;

    try {
      await this.audio.play();
    } catch (err) {
      // Likely autoplay policy if not from a user gesture
      return Promise.reject(err);
    }
  }

  /** Resume current song */
  async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  pause(): void {
    this.audio.pause();
  }

  /** Next track (wraps to start). Requires at least one prior user gesture */
  async next(): Promise<void> {
    if (!this.playlist.length) return Promise.reject('Empty playlist');
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    return this.playSong(nextIndex);
  }

  /** Previous track (wraps to end). Requires at least one prior user gesture */
  async previous(): Promise<void> {
    if (!this.playlist.length) return Promise.reject('Empty playlist');
    const prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    return this.playSong(prevIndex);
  }

  /** State helpers */
  getCurrentSong() { return this.playlist[this.currentIndex]; }
  getCurrentTime() { return this.audio.currentTime; }
  seekTo(seconds: number) { this.audio.currentTime = Math.max(0, Number(seconds) || 0); }
  isCurrentlyPlaying(): boolean { return !this.audio.paused && !this.audio.ended; }
}
