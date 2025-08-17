import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonSelectOption } from '@ionic/angular/standalone';
import { RouterLink, RouterModule } from '@angular/router';
import { StreamSettings, StreamQuality } from 'tunzo-player'; 

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, RouterLink, RouterModule, IonSelectOption, ReactiveFormsModule]
})
export class SettingsPage implements OnInit {


  qualityOptions: StreamQuality[] = [];


  selectedQuality!: number;

  constructor() { }

  ngOnInit(): void {
    this.qualityOptions = StreamSettings.getOptions();

    const currentQuality = StreamSettings.loadQuality();
    
    this.selectedQuality = currentQuality.value;
    console.log('Current Quality:', this.selectedQuality);
  }

  changeQuality(event: any) {
    const value = parseInt(event.detail.value);
    const updatedQuality = StreamSettings.updateQuality(value);
    this.selectedQuality = updatedQuality.value;
    console.log('Selected Quality:', updatedQuality);
  }

}
