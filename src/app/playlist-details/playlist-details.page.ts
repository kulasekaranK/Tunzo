import { ChangeDetectorRef, Component, OnDestroy, signal } from '@angular/core';
import { IonContent, IonFab, IonFabButton, ModalController, IonButton, AlertController, NavController } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/saavn.service';
import { CommonModule } from '@angular/common';
import { Player } from 'tunzo-player';
import { MusicControlsComponent } from '../components/controls/controls.page';
import { AddSongPage } from '../add-song/add-song.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.page.html',
  styleUrls: ['./playlist-details.page.scss'],
  standalone: true,
  imports: [IonButton, IonFabButton, IonFab, 
    IonContent, CommonModule,
    MusicControlsComponent
],
})
export class PlaylistDetailsPage implements OnDestroy {
  songs: any[] = [];
  playlist: any = {};
  likedSongLoading = signal<boolean>(true);
  player = Player
  private playlistId: number;

 constructor(
    private firebaseService: FirestoreService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.playlistId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlaylistDetails();
  }

  async loadPlaylistDetails() {
    this.playlist = await this.firebaseService.getPlaylistById(this.playlistId);
    this.songs = (await this.firebaseService.getSongsForPlaylist(this.playlistId)).reverse();
    this.likedSongLoading.set(false);
    if (this.songs && this.songs.length) {
      this.player.initialize(this.songs);
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }



  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Playlist',
      message: 'Are you sure you want to delete this playlist? This action cannot be undone.',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.firebaseService.deletePlaylist(this.playlistId);
            this.navCtrl.back();
          },
        },
      ],
    });

    await alert.present();
  }
}