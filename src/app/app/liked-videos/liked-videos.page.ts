import { ChangeDetectorRef, Component, OnDestroy, signal } from '@angular/core';
import { IonContent, IonFab, IonFabButton, ModalController, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from '../../services/saavn.service';
import { CommonModule } from '@angular/common';
import { Player } from 'tunzo-player';
import { MusicControlsComponent } from "../../components/controls/controls.page";

@Component({
  selector: 'app-liked-videos',
  templateUrl: './liked-videos.page.html',
  styleUrls: ['./liked-videos.page.scss'],
  standalone: true,
  imports: [IonButton, IonFabButton, IonFab, 
    IonContent, CommonModule,
    MusicControlsComponent
],
})
export class LikedVideosPage implements OnDestroy {
  subscribe: any;
  likedVideosLoading = signal<boolean>(true);
  likedVideos: any[] = [];
  player = Player

  constructor(
    private firebaseService: FirestoreService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subscribe = this.firebaseService.likedVideos$.subscribe((data: any[]) => {
      this.likedVideos = data || [];
      this.likedVideosLoading.set(false);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  unlikeVideo(video: any) {
    this.firebaseService.unlikeVideo(video.id);
  }
}