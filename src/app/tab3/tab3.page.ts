import { ChangeDetectorRef, Component, OnDestroy, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/saavn.service';
import { CommonModule } from '@angular/common';
import { Player } from 'tunzo-player';
import { MusicControlsComponent } from "../components/controls/controls.page";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonContent, CommonModule,
    MusicControlsComponent
],
})
export class Tab3Page implements OnDestroy {
  songs: any[] = [];
  subscribe: any;
  likedSongLoading = signal<boolean>(true);
  homePageSongs: any[] = [];
  player = Player
 constructor(
    private firebaseService: FirestoreService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subscribe = this.firebaseService.getCollectionData('likedSongs').subscribe((data: any[]) => {
      this.homePageSongs = data || [];
      this.likedSongLoading.set(false);
      if (data && data.length) {
        this.player.initialize(data);
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
  
}
