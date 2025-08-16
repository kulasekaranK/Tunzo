import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonContent, IonSearchbar, IonIcon, IonSpinner, IonNote } from '@ionic/angular/standalone';
import { MusicControlsComponent } from "../components/controls/controls.page";
import {TunzoPlayerAPI,Player} from 'tunzo-player';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonNote,
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonContent, IonSearchbar,
    IonIcon, IonSpinner,
    MusicControlsComponent]
})
export class Tab2Page {
 chips: string[] = ["Chill", "Workout", "Romantic", "Party", "Focus", "Sleep"];

  searchQuery = signal('');
  songs: any[] = [];
  loading = false;
  results = signal<any>([]);

  api = new TunzoPlayerAPI();
  player = Player;

  constructor() {
   console.log(this.results);
     effect(async () => {
    const resp: any =  await this.api.searchSongs(this.searchQuery());  
     if(resp){
       this.results.set(resp);
       console.log(this.results()); 
       Player.initialize(this.results());
     }
  })
   
  }
 async ngOnInit(){

  }
  playSong(song: any) {
    Player.unlockAudio();
    Player.play(song)
  }
  selectChip(chip: string) {
  this.searchQuery.set(chip + 'tamil');
}
}
