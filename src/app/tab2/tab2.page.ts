import { Component, effect, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonContent, IonSearchbar, IonIcon, IonSpinner, IonNote, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { TunzoPlayerAPI, Player } from 'tunzo-player';
import { YtmusicService } from '../services/ytmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirestoreService } from '../services/saavn.service';

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
  loading = signal<boolean>(false);
  results = signal<any[]>([]);
  videoResults: WritableSignal<{ video: any; safeUrl: SafeResourceUrl; isLiked: boolean; }[]> = signal([]);
  searchSource: 'tunzo' | 'youtube' = 'tunzo';
  likedVideos = signal<string[]>([]);

  api = new TunzoPlayerAPI();
  player = Player;

  constructor(
    private ytmusicService: YtmusicService,
    private sanitizer: DomSanitizer,
    private firestoreService: FirestoreService
  ) {
    this.firestoreService.likedVideos$.subscribe(videos => {
      this.likedVideos.set(videos.map(v => v.id));
    });

    effect(() => {
      this.handleSearch();
    });
  }

  segmentChanged(event: any) {
    this.searchSource = event.detail.value;
    this.results.set([]);
    this.videoResults.set([]);
    this.handleSearch();
  }

  private async handleSearch() {
    const query = this.searchQuery();
    if (!query) {
      this.results.set([]);
      this.videoResults.set([]);
      return;
    }

    this.loading.set(true);
    if (this.searchSource === 'tunzo') {
      this.videoResults.set([]);
      const resp: any = await this.api.searchSongs(query);
      if (resp) {
        this.results.set(resp);
        Player.initialize(this.results());
      }
    } else {
      this.results.set([]);
      this.ytmusicService.searchSongs(query).subscribe(ytResults => {
        console.log('org result' , ytResults);
        const videos = ytResults.filter((item: any) => item.type === 'VIDEO' || item.type === 'SONG');
        const videoItems = videos.map((item: any) => {
          const videoData = {
            id: item.videoId,
            name: item.name,
            image: item.thumbnails.map((t: any) => ({ url: t.url })),
            artists: { primary: [{ name: item.artist?.name, image: '' }] },
            album: { name: item.album?.name || '' },
            year: new Date().getFullYear(),
            label: 'YouTube',
            url: `https://www.youtube.com/watch?v=${item.videoId}`,
            type: 'video'
          };
          return {
            video: videoData,
            safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${item.videoId}`),
            isLiked: this.likedVideos().includes(item.videoId)
          }
        });
        this.videoResults.set(videoItems);
      });
    }
    this.loading.set(false);
  }

  async toggleLike(videoItem: { video: any; isLiked: boolean; }) {
    if (videoItem.isLiked) {
      await this.firestoreService.unlikeVideo(videoItem.video.id);
    } else {
      await this.firestoreService.likeVideo(videoItem.video);
    }
    videoItem.isLiked = !videoItem.isLiked;
    this.videoResults.update(videos => [...videos]);
  }

  playSong(song: any) {
    Player.unlockAudio();
    Player.play(song);
  }

  selectChip(chip: string) {
    this.searchQuery.set(chip + ' tamil');
  }

  addToQueue(song: any) {
    Player.addToQueue(song);
    console.log(`${song.name} added to queue`);
  }
}
