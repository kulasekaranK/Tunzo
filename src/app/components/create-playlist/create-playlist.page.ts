import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonList, IonInput, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { FirestoreService } from '../../services/saavn.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.page.html',
  styleUrls: ['./create-playlist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, CommonModule, FormsModule, IonButtons, IonButton, IonInput, IonItem, IonLabel]
})
export class CreatePlaylistPage {
  playlistName = '';
  playlistDescription = '';

  constructor(
    private modalCtrl: ModalController,
    private firestoreService: FirestoreService
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async createPlaylist() {
    if (this.playlistName.trim().length === 0) {
      return;
    }
    await this.firestoreService.createPlaylist(this.playlistName, this.playlistDescription);
    this.modalCtrl.dismiss({ created: true });
  }
}
