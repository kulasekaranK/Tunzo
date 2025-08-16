import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { SaavnApiService } from '../services/saavn.service';
import { AudioPlayerService } from '../services/player.service';
import { addIcons } from 'ionicons';
import { play, pause } from 'ionicons/icons';
import { MusicControlsComponent } from "../components/controls/controls.page";

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon, IonSpinner,
    MusicControlsComponent
]
})
export class Tab2Page {
  searchQuery = '';
  songs: any[] = [];
  loading = false;

  constructor(
    private saavn: SaavnApiService,
    public player: AudioPlayerService
  ) {
    addIcons({ play, pause });
  }

  onSearchChange(ev: any) {
    const query = ev.detail.value?.trim();
    if (!query) {
      this.songs = [];
      return;
    }
    this.loading = true;
    this.saavn.searchSongs(query, 30).subscribe({
      next: (res: any) => {
        this.songs = res?.data?.results || [];
        this.loading = false;
      },
      error: () => {
        this.songs = [];
        this.loading = false;
      }
    });
  }

  async playSong(index: number) {
    this.player.setPlaylist(this.songs, index);
    try {
      await this.player.playSong(index);
    } catch (err) {
      console.error('Error playing song', err);
    }
  }

  isPlaying(index: number): boolean {
    return this.player.isCurrentlyPlaying() &&
           this.player.getCurrentSong()?.id === this.songs[index]?.id;
  }

  pause() {
    this.player.pause();
  }
}
