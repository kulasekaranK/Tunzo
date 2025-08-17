import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonFooter, IonToolbar, IonProgressBar, IonModal,ToastController, IonContent, IonReorder, IonLabel, IonReorderGroup, IonThumbnail, IonItem, IonList, IonCardContent, IonCardHeader, IonCard, IonText, IonRange } from "@ionic/angular/standalone";
import { FirestoreService } from 'src/app/services/saavn.service';
import { Player, StreamSettings } from 'tunzo-player';

@Component({
  selector: 'app-music-controls',
  templateUrl: './controls.page.html',
  styleUrls: ['./controls.page.scss'],
  imports: [IonRange, IonText, IonCard, IonCardHeader, IonCardContent, IonList, IonItem, IonReorderGroup, IonLabel, IonReorder, IonContent, IonModal, IonProgressBar, IonToolbar, IonFooter, IonThumbnail]
})
export class MusicControlsComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  player = Player;
  stramQuality = StreamSettings.loadQuality();
  isModalOpen = false;
  queue = signal<any[]>([]);
  isLiked = signal(false);
  currentSong = signal<any>(Player.getCurrentSong());
  lastSongId: string | undefined;

  constructor(private sanitizer: DomSanitizer,
    private firebaseService: FirestoreService,
    private toastController: ToastController
  ) { 

  }
  ngOnInit() {
    this.checkIfLiked(Player.getCurrentSong());
    Player.queue$.subscribe(q => {
      console.log('Queue updated:', q);

      this.queue.set(q);
    });

      setInterval(() => {
    const current = Player.getCurrentSong();
    if (current?.id !== this.lastSongId) {
      this.lastSongId = current?.id;
      this.checkIfLiked(current);
    }
  }, 500); 

  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.modal.dismiss();
  }

  onModalDismiss() {
    this.modal.dismiss();
    console.log('Modal dismissed');
    this.isModalOpen = false;
  }

  handleReorder(event: any) {
    Player.reorderQueue(event.detail.from, event.detail.to);

    event.detail.complete();

    console.log('Queue reordered:', Player.getQueue());
  }

    async toggleLikeSong(song: any) {
    if (!song) return;

      if (this.isLiked()) {
        await this.firebaseService.unlikeSong(song.id);
        this.showToast(`${song.name} is Unliked`, 'warning');
      } else {
        await this.firebaseService.likeSong(song);
        this.showToast(`${song.name} is Liked`, 'primary');
      }
   

    this.isLiked.set(!this.isLiked);
  }


  async checkIfLiked(song: any) {
    if (!song) return;
      console.log('true');
      this.isLiked.set(await this.firebaseService.isSongLiked(song.id));
  }

    async showToast(message: string, color: string = 'secondary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    toast.present();
  }



}
