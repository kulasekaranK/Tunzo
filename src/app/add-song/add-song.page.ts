// add-song.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
  IonLoading,
  IonAlert,
  ModalController
} from '@ionic/angular/standalone';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.page.html',
  styleUrls: ['./add-song.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonButtons,
    IonLoading,
    IonAlert
  ]
})
export class AddSongPage {
  // form model
  song: any = {
    id: '',
    name: '',
    album: '',
    language: '',
    year: '',
    duration: 0,
    imageUrl: '',
    downloadUrl: [
        { quality: '12kbps', url: '' },
          { quality: '48kbps', url: '' },
          { quality: '160kbps', url: '' },
          { quality: '320kbps', url: '' },
    ],
    artists: ''
  };

  isSaving = false;
  showAlert = false;
  alertHeader = '';
  alertMessage = '';

  constructor(private firestore: Firestore, private modalCtrl: ModalController) {
      // Generate ID on load
  this.song.id = this.generateId();
  }
  generateId(): string {
  // Example: SONG-xy8f2-9321
  return 'SONG-' + Math.random().toString(36).substr(2, 6).toUpperCase() + 
         '-' + Date.now().toString().slice(-4);
}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async saveSong() {
    this.isSaving = true;
    try {
      const docRef = await addDoc(collection(this.firestore, 'likedSongs'), {
        ...this.song,
        downloadUrl: this.song.downloadUrl.filter((d: any) => d.url.trim() !== ''),
        artists: this.song.artists.split(',').map((a: string) => a.trim()),
        createdAt: serverTimestamp(),
        isAdded: true
      });
      console.log('Song added with ID:', docRef.id);

      this.alertHeader = 'Success';
      this.alertMessage = 'Song added successfully';
      this.showAlert = true;

      this.song = {
        id: '',
        name: '',
        album: '',
        language: '',
        year: '',
        duration: 0,
        imageUrl: '',
        downloadUrl : [
          { quality: '12kbps', url: '' },
          { quality: '48kbps', url: '' },
          { quality: '160kbps', url: '' },
          { quality: '320kbps', url: '' },
        ],
        artists: ''
      };

    } catch (err) {
      console.error('Error adding song:', err);
      this.alertHeader = 'Error';
      this.alertMessage = 'Failed to save song';
      this.showAlert = true;
    } finally {
      this.isSaving = false;
    }
  }
}
