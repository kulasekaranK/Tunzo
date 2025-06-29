import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {TunzoPlayerAPI, Player} from 'tunzo-player'; // if you want all in a namespace


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page implements OnInit {
  results:any;
  constructor() {
   console.log(this.results);
   
  }
 async ngOnInit(){
    const api = new TunzoPlayerAPI();
    this.results = await api.searchSongs('popular songs');
    console.log(this.results);
    Player.initialize(this.results, 3);
    Player.play(this.results[7], 3);
    Player.addToQueue(this.results[6]);
    console.log( Player.getQueue());
    
  }
}
