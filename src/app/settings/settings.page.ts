import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonSelect,
  IonSelectOption,
  ToastController,
} from '@ionic/angular/standalone';
import { RouterLink, RouterModule } from '@angular/router';
import { StreamSettings, StreamQuality } from 'tunzo-player';

import { ReleaseNotesComponent } from '../components/release-notes/release-notes.component';
import { FirestoreService } from '../services/saavn.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    IonContent,
    IonHeader,
    IonSelect, // ✅ add this
    IonSelectOption, // ✅ keep this
    ReleaseNotesComponent,
  ],
})
export class SettingsPage implements OnInit {
  qualityOptions: StreamQuality[] = [];

  selectedQuality!: number;

  constructor(
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.qualityOptions = StreamSettings.getOptions();

    const currentQuality = StreamSettings.loadQuality();

    this.selectedQuality = currentQuality.value ? currentQuality.value : 2;
    console.log('Current Quality:', this.selectedQuality);
  }

  changeQuality(event: any) {
    const value = parseInt(event.detail.value);
    const updatedQuality = StreamSettings.updateQuality(value);
    this.selectedQuality = updatedQuality.value;
    console.log('Selected Quality:', updatedQuality);
  }

  async migrate() {
    const toast = await this.toastController.create({
      message: 'Starting migration from Firestore... Do not close the app.',
      duration: 3000,
      position: 'top',
    });
    await toast.present();

    try {
      await this.firestoreService.migrateLikesFromFirestore();
      const successToast = await this.toastController.create({
        message: 'Migration completed successfully!',
        duration: 3000,
        position: 'top',
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      const errorToast = await this.toastController.create({
        message: 'Migration failed. Check console for errors.',
        duration: 5000,
        position: 'top',
        color: 'danger',
      });
      await errorToast.present();
      console.error('Migration error:', error);
    }
  }
}
