import { ChangeDetectorRef, Component, OnDestroy, signal } from '@angular/core';
import { IonContent, IonFab, IonFabButton, ModalController, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/saavn.service';
import { CommonModule } from '@angular/common';
import { Player } from 'tunzo-player';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { AddSongPage } from '../add-song/add-song.page';
import { Router } from '@angular/router';
import { CreatePlaylistPage } from '../components/create-playlist/create-playlist.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonButton, IonFabButton, IonFab, 
    IonContent, CommonModule,
    MusicControlsComponent
  ],
})
export class Tab3Page implements OnDestroy {
  songs: any[] = [];
  subscribe: any;
  subscribeVideos: any;
  subscribePlaylists: any;
  homePageSongs: any[] = [];
  likedVideos: any[] = [];
  playlists: any[] = [];
  player = Player
  constructor(
    private firebaseService: FirestoreService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.subscribe = this.firebaseService.getCollectionData('likedSongs').subscribe((data: any[]) => {
      this.homePageSongs = data || [];
      this.cdr.detectChanges();
    });

    this.subscribeVideos = this.firebaseService.likedVideos$.subscribe((data: any[]) => {
      this.likedVideos = data || [];
      this.cdr.detectChanges();
    });

    this.subscribePlaylists = this.firebaseService.playlists$.subscribe((data: any[]) => {
      this.playlists = data || [];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    if (this.subscribeVideos) {
      this.subscribeVideos.unsubscribe();
    }
    if (this.subscribePlaylists) {
      this.subscribePlaylists.unsubscribe();
    }
  }

  goToLikedSongs() {
    this.router.navigate(['/liked-songs']);
  }

  goToLikedVideos() {
    this.router.navigate(['/liked-videos']);
  }

  goToPlaylist(playlistId: number) {
    this.router.navigate(['/playlist', playlistId]);
  }

  async openCreatePlaylistModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePlaylistPage,
    });
    await modal.present();
  }

    async openAddSongModal() {
    const modal = await this.modalCtrl.create({
      component: AddSongPage,
    });
    await modal.present();
  }
}