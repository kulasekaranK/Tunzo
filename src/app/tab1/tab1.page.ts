import { Component, OnInit, signal } from '@angular/core';
import { IonContent, IonCard, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonCardContent, IonFooter, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';
import {TunzoPlayerAPI,Player} from 'tunzo-player';
import { MusicControlsComponent } from "../components/controls/controls.page"; // if you want all in a namespace


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButtons, IonButton, IonIcon, IonFooter, IonCardContent, IonLabel, IonItem, IonList, IonTitle, IonToolbar, IonHeader, IonCard,
    IonContent, MusicControlsComponent],
})
export class Tab1Page implements OnInit {
  results = signal<any>([]);
  issPlaying: boolean = false;
  dur:any
  error:any;
  api = new TunzoPlayerAPI();
  player = Player;

  constructor() {
   console.log(this.results);
   
  }
 async ngOnInit(){
   
    const resp: any =  await this.api.searchSongs('tamilhits');
    if(resp){
      this.results.set(resp);
      console.log(this.results); 
      Player.initialize(this.results());
    }
  }
  playSong(song: any) {
    Player.unlockAudio();
    Player.play(song)
  }
  
}
