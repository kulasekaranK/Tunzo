import { Component, OnInit } from '@angular/core';
import { IonFooter, IonToolbar, IonProgressBar } from "@ionic/angular/standalone";
import {Player} from 'tunzo-player';

@Component({
  selector: 'app-music-controls',
  templateUrl: './controls.page.html',
  styleUrls: ['./controls.page.scss'],
  imports: [IonProgressBar, IonToolbar, IonFooter]
})
export class MusicControlsComponent implements OnInit {
  player = Player;


  ngOnInit() {
    console.log('data', Player.getCurrentSong());
    
  }
}
