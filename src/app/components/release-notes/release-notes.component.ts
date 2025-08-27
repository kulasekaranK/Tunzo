import { Component, OnInit } from '@angular/core';
import { ReleaseNotesService } from '../../services/release-notes.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ReleaseNotesComponent implements OnInit {

   releaseNotes!: { version: string, notes: string[] };

  constructor(private releaseNotesService: ReleaseNotesService) { }

  ngOnInit() {
    this.releaseNotes = this.releaseNotesService.getReleaseNotes();
  }

}
