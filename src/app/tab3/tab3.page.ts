import { ChangeDetectorRef, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonLabel, IonItem, IonList, IonThumbnail } from '@ionic/angular/standalone';
import { SaavnApiService } from '../services/saavn.service';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { AudioPlayerService } from '../services/player.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [ IonList, IonItem, IonLabel, IonButton, IonIcon, IonHeader,
     IonToolbar, IonTitle, IonContent, MusicControlsComponent, IonThumbnail, CommonModule],
})
export class Tab3Page {
  songs: any[] = [];
  constructor(private SaavnApiService: SaavnApiService,
    private cdr: ChangeDetectorRef,
    public player: AudioPlayerService
  ) {
     this.SaavnApiService.getCollectionData('likedSongs').subscribe((data: any) => {
          this.songs.push(...data);
          this.cdr.detectChanges();
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
