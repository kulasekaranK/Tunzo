import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent, IonButton } from '@ionic/angular/standalone';
import { SaavnApiService } from './services/saavn.service';
import { AudioPlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonButton, IonContent, IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent implements OnInit {
  results: any[] = [];
  // Keep a simple playing flag for UI toggles
  isPlaying = false;

  constructor(
    private saavn: SaavnApiService,
    public player: AudioPlayerService
  ) {}

  ngOnInit() {
    // Just fetch + set playlist. DO NOT autoplay here (blocked by autoplay policy)
    this.saavn.searchSongs('Anirudh', 250).subscribe((res: any) => {
      const items = res?.data?.results || [];
      this.results = items;
      this.player.setPlaylist(items);
    });
  }

  // Call this from a real user gesture (button click) to start playback
  startFirst() {
    // Start only after a tap to satisfy autoplay policy
    this.player.playSong(0).then(() => {
      this.isPlaying = true;
    }).catch(() => {
      this.isPlaying = false;
    });
  }

  playPause() {
    if (this.player.isCurrentlyPlaying()) {
      this.player.pause();
      this.isPlaying = false;
    } else {
      this.player.play().then(() => this.isPlaying = true).catch(() => this.isPlaying = false);
    }
  }

  next() {
    this.player.next().then(() => this.isPlaying = true).catch(() => this.isPlaying = false);
  }

  prev() {
    this.player.previous().then(() => this.isPlaying = true).catch(() => this.isPlaying = false);
  }
}