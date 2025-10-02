import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { ReleaseNotesService } from './services/release-notes.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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
    private releaseNotesService: ReleaseNotesService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await LocalNotifications.requestPermissions();
    this.notif.scheduleBasic();
    this.presentReleaseNotesAlert();
    
    // Check authentication state - only navigate if not already on the correct route
    this.authService.user$.subscribe(user => {
      const currentUrl = this.router.url;
      
      if (user && !currentUrl.startsWith('/tabs')) {
        // User is authenticated but not on tabs, navigate to tabs
        this.router.navigate(['/tabs/tab1']);
      } else if (!user && currentUrl !== '/login') {
        // User is not authenticated and not on login, navigate to login
        this.router.navigate(['/login']);
      }
    });
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
