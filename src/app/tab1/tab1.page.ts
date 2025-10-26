import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { IonContent, IonList, IonItem, IonLabel, IonNote, IonSkeletonText, IonPopover, IonButton, IonSearchbar } from '@ionic/angular/standalone';
import {TunzoPlayerAPI,Player, StreamSettings} from 'tunzo-player';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterModule } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { YtmusicService } from '../services/ytmusic.service';
import { AiService } from '../services/ai.service';
import { AiContentComponent } from '../services/ai-content.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [AiContentComponent, IonButton,  IonSkeletonText,  IonNote, IonLabel, IonItem, IonList,
    IonContent, MusicControlsComponent, FormsModule, RouterLink, RouterModule, IonSearchbar],
})
export class Tab1Page implements OnInit {
  results = signal<any>([]);
  issPlaying: boolean = false;
  dur:any
  error:any;
  api = new TunzoPlayerAPI();
  player = Player;
  loading = signal<boolean>(false);
  aiPrompt = '';

  constructor( private notif: NotificationService, private ytmusicService: YtmusicService,
    private aiService : AiService, private authService: AuthService
  ) {
   this.notif.scheduleBasic();
   this.aiPrompt = this.createGreetingPrompt();
  }
  private createGreetingPrompt(): string {
    let userName = 'User'; // default
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.displayName) {
      userName = currentUser.displayName;
    }
  
    // Get user's local date, time, and weekday
    const now = new Date();
    // Using a richer format for the AI to pick up on the specific day (e.g., Saturday) and time (e.g., 1:36 AM)
    const localDateTime = now.toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  
    // Create a clear, direct prompt for Gemini
    return `
      The user's name is ${userName}.
      The user is viewing the homepage. The current local time and day is: ${localDateTime}.
      
      Generate a warm, creative, and personalized welcome message that is suitable for a mobile-friendly homepage.
      
      The output must be formatted using **strictly Markdown** and contain two parts to offer more content:
      
      1.  A Level 4 Markdown heading (####) containing the personalized greeting (e.g., "Good Evening, [Name]!").
      2.  A single, contextual sentence immediately below the heading that provides a relevant and personalized suggestion or note based on the day of the week or time (e.g., "Time for a smooth jazz playlist to unwind this Sunday evening." or "A powerful new workout mix is waiting for your Monday morning.")
      
      Example of desired output format:
      #### Happy Friday, ${userName}!
      Ready to kick off the weekend? We've updated your party playlist recommendations.
      
      Output **only** the complete Markdown text. Do not include any extra introductory text, conversational fillers, or quotes.
    `;
  }

  

 async ngOnInit(){
  await LocalNotifications.requestPermissions();
  this.loading.set(true);
  const resp: any =  await this.api.searchSongs('tamil hits');
  if(resp){
    this.results.set(resp);
    console.log(this.results()); 
    const currentQuality = StreamSettings.loadQuality();
    Player.initialize(this.results(), currentQuality.value);
  }
  this.loading.set(false);
  }

  
  playSong(song: any) {
    Player.unlockAudio();
    Player.play(song)
  }

 async callnoti(){
      await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Tunzo Update!',
          body: `Tunzo current version is ${environment.appVersion}`,
          id: 1,
          extra: {
            data: 'goes here',
          },
          iconColor: '#0000FF',
          sound: 'fav.wav',
          schedule: { at: new Date(Date.now() + 1000 * 5),
            allowWhileIdle: true
           },
        }
      ]
    });
 }
  
}
