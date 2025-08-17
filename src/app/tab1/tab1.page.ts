import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { IonContent, IonList, IonItem, IonLabel, IonNote, IonSkeletonText, IonPopover } from '@ionic/angular/standalone';
import {TunzoPlayerAPI,Player, StreamSettings} from 'tunzo-player';
import { MusicControlsComponent } from "../components/controls/controls.page";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonSkeletonText,  IonNote, IonLabel, IonItem, IonList,
    IonContent, MusicControlsComponent, FormsModule, RouterLink, RouterModule],
})
export class Tab1Page implements OnInit {
  results = signal<any>([]);
  issPlaying: boolean = false;
  dur:any
  error:any;
  api = new TunzoPlayerAPI();
  player = Player;
  loading = signal<boolean>(true);

  constructor() {
    this.loading.set(true);
   
  }
 async ngOnInit(){
   
    const resp: any =  await this.api.searchSongs('tamilhits');
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


  
}
