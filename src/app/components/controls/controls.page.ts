import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonFooter, IonToolbar, IonProgressBar, IonModal,ToastController, IonContent, IonReorder, IonLabel, IonReorderGroup, IonThumbnail, IonItem, IonList, IonCardContent, IonCardHeader, IonCard, IonText, IonRange, ModalController } from "@ionic/angular/standalone";
import { FirestoreService } from 'src/app/services/saavn.service';
import { Player, StreamSettings } from 'tunzo-player';
import { AddToPlaylistPage } from '../add-to-playlist/add-to-playlist.page';
import { AiContentComponent } from 'src/app/services/ai-content.component';

@Component({
  selector: 'app-music-controls',
  templateUrl: './controls.page.html',
  styleUrls: ['./controls.page.scss'],
  imports: [IonRange, IonText, IonCard, IonCardHeader, IonCardContent, IonList, IonItem,
     IonReorderGroup, IonLabel, IonReorder, IonContent, IonModal, IonProgressBar, IonToolbar,
      IonFooter, IonThumbnail, AiContentComponent]
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
  aiPrompt = signal('');

  constructor(private sanitizer: DomSanitizer,
    private firebaseService: FirestoreService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
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
      this.aiPrompt.set(this.createSongSummaryPrompt(Player.getCurrentSong()));
    }
  }, 500); 

  }

  private createSongSummaryPrompt(song: any): string {
   // 1. Destructure and extract only the most relevant song details.
  const relevantSongData = {
    name: song.name,
    artist: song.artists.primary.map((a: any) => a.name).join(', '),
    album: song.album.name,
    year: song.year,
    language: song.language,
    playCount: song.playCount,
    lyricist: song.artists.all.filter((a: any) => a.role === 'lyricist').map((a: any) => a.name).join(', ') || 'N/A',
  };

  // 2. Stringify the clean, minimal object
  const relevantSongString = JSON.stringify(relevantSongData);

  // 3. Create a clear, direct prompt for a Markdown summary
  return `
    The user is currently listening to a song with the following details:
    
    ${relevantSongString}
    
    Generate a **complete, insightful summary** about this song. The output must be formatted using **strictly Markdown** for mobile readability.
    
    The summary must follow this structure exactly:
    
    1.  A Level 2 Markdown heading (##) containing the song name and primary artist.
    2.  A brief, engaging opening sentence about the song's general theme or mood.
    3.  A bulleted list containing three key facts:
        -   **Release/Album Details** (Year and Album Name)
        -   **Language/Genre Context** (Language, and an assumed genre like 'Indie Pop' or 'Film Track')
        -   **Popularity** (Mentioning the Play Count in a compelling way)
    
    Example Output Format:
    
    ## Aasa Kooda by Sai Abhyankkar
    This track is a vibrant, feel-good Tamil independent single that captures the excitement of new love.
    
    * **Release:** 2024 on the album 'Aasa Kooda from Think Indie'
    * **Context:** A catchy Tamil Indie Pop song with lyrics by Sathyan Ilanko.
    * **Popularity:** This popular track has been streamed over 29 million times!
    
    Output **only** the complete Markdown text. Do not include any extra introductory text, conversational fillers, or quotes.
  `;
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

  async openAddToPlaylistModal() {
    const modal = await this.modalCtrl.create({
      component: AddToPlaylistPage,
      componentProps: {
        song: Player.getCurrentSong()
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.added) {
      this.showToast('Song added to playlist', 'success');
    }
  }

}
