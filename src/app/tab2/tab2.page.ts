import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonContent, IonSearchbar, IonIcon, IonSpinner, IonNote, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { TunzoPlayerAPI, Player } from 'tunzo-player';
import { YtmusicService } from '../services/ytmusic.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonNote, IonLabel, IonSegment, IonSegmentButton,
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonContent, IonSearchbar,
    IonIcon, IonSpinner,
    MusicControlsComponent]
})
export class Tab2Page {
  chips: string[] = ["Chill", "Workout", "Romantic", "Party", "Focus", "Sleep"];

  searchQuery = signal('');
  songs: any[] = [];
 loading = signal<boolean>(false);
  results = signal<any>([]);
  searchSource: 'tunzo' | 'youtube' = 'tunzo';

  api = new TunzoPlayerAPI();
  player = Player;

  constructor(private ytmusicService: YtmusicService) {
    console.log(this.results);
  }

  segmentChanged(event: any) {
    this.searchSource = event.detail.value;
    this.handleSearch();
  }

  handleInput(event: any) {
    this.searchQuery.set(event.target.value.toLowerCase());
    this.handleSearch();
  }

  private async handleSearch() {
    const query = this.searchQuery();
    if (!query) {
      this.results.set([]);
      return;
    }

    this.loading.set(true);
    if (this.searchSource === 'tunzo') {
      const resp: any = await this.api.searchSongs(query);
      if (resp) {
        this.results.set(resp);
        Player.initialize(this.results());
      }
    } else {
      this.ytmusicService.searchSongs(query).subscribe(ytResults => {
        console.log('org result' , ytResults);
        console.log('transformed result' , this.transformYtMusicResults(ytResults));
        this.results.set(this.transformYtMusicResults(ytResults));
        Player.initialize(this.results());
      });
    }
    this.loading.set(false);
  }

  private transformYtMusicResults(results: any[]): any[] {
    return results.map(item => ({
      id: item.videoId,
      name: item.title,
      image: item.thumbnails.map((t: any) => ({ url: t.url })),
      artists: { primary: [{ name: item.artist, image: '' }] },
      playCount: null, // Not available from ytmusic-api
      year: new Date().getFullYear(), // Not available from ytmusic-api
      copyright: null, // Not available from ytmusic-api
      album: { name: item.title },
      label: 'YouTube',
      url: `https://www.youtube.com/watch?v=${item.videoId}`
    }));
  }

  playSong(song: any) {
    if (this.searchSource === 'youtube') {
      this.ytmusicService.getDownloadLink(song.id).subscribe((data: any) => {
        console.log('data' , data);
        const quality = localStorage.getItem('quality') || '3';
        let downloadUrl = '';
        if (quality === '1') {
          const lowQuality = data.downloadUrls.find((u: any) => u.quality === 'AUDIO_QUALITY_LOW');
          if (lowQuality) {
            downloadUrl = lowQuality.url;
          }
        } else {
          const highQuality = data.downloadUrls.find((u: any) => u.quality === 'AUDIO_QUALITY_HIGH');
          if (highQuality) {
            downloadUrl = highQuality.url;
          }
        }

        if (!downloadUrl) {
          // Fallback to the first available url
          downloadUrl = data.downloadUrls[0].url;
        }

        song.downloadUrl = downloadUrl;
        Player.unlockAudio();
        Player.play(song);
      });
    } else {
      Player.unlockAudio();
      Player.play(song);
    }
  }
  selectChip(chip: string) {
    this.searchQuery.set(chip + ' tamil');
    this.handleSearch();
  }
  addToQueue(song: any) {
    Player.addToQueue(song); // Use your Player package's method
    console.log(`${song.name} added to queue`);
  }

  downloadSong(song: any) {
    if (this.searchSource === 'youtube') {
      this.ytmusicService.getDownloadLink(song.id).subscribe((data: any) => {
        const highQuality = data.downloadUrls.find((u: any) => u.quality === 'AUDIO_QUALITY_HIGH');
        let downloadUrl = highQuality ? highQuality.url : data.downloadUrls[0].url;
        window.open(downloadUrl, '_blank');
      });
    }
  }
}
