import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonList, IonItem, IonLabel, ModalController, NavParams } from '@ionic/angular/standalone';
import { FirestoreService } from '../../services/saavn.service';

@Component({
  selector: 'app-add-to-playlist',
  templateUrl: './add-to-playlist.page.html',
  styleUrls: ['./add-to-playlist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonList, IonItem, IonLabel]
})
export class AddToPlaylistPage implements OnInit {
  playlists: any[] = [];
  @Input() song: any;

  constructor(
    private modalCtrl: ModalController,
    private firestoreService: FirestoreService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.song = this.navParams.get('song');
    this.firestoreService.playlists$.subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async addToPlaylist(playlistId: number) {
    await this.firestoreService.addSongToPlaylist(playlistId, this.song);
    this.modalCtrl.dismiss({ added: true });
  }
}
