import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { ReleaseNotesService } from './services/release-notes.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from './services/saavn.service';
import { CommonModule } from '@angular/common';
import { AuthLoaderComponent } from './components/auth-loader/auth-loader.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CommonModule, AuthLoaderComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(
    private notif: NotificationService,
    private alertController: AlertController,
    private releaseNotesService: ReleaseNotesService,
    public authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.firestoreService.initDB();
  }

  async ngOnInit(): Promise<void> {
    await LocalNotifications.requestPermissions();
    this.notif.scheduleBasic();
    this.presentReleaseNotesAlert();
  }

  async presentReleaseNotesAlert() {
    if (this.releaseNotesService.shouldShowReleaseNotes()) {
      const releaseNotes = this.releaseNotesService.getReleaseNotes();
      const alert = await this.alertController.create({
        header: `Update ${releaseNotes.version}`,
        message: releaseNotes.notes.join('\n'),
        cssClass: 'alert-pre-line',
        mode: 'ios',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.releaseNotesService.markReleaseNotesAsSeen();
            },
          },
        ],
      });

      await alert.present();
    }
  }
}
