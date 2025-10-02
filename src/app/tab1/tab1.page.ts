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

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton,  IonSkeletonText,  IonNote, IonLabel, IonItem, IonList,
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

  constructor( private notif: NotificationService, private ytmusicService: YtmusicService) {
   this.notif.scheduleBasic();
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
