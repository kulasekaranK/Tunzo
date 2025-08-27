import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { ReleaseNotesService } from './services/release-notes.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(
    private notif: NotificationService,
    private alertController: AlertController,
    private releaseNotesService: ReleaseNotesService
  ) {}

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
        message: releaseNotes.notes.join('<br>'),
        mode: 'ios',
        cssClass: 'alert-pre-line',
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
