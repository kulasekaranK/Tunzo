import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService {
  private readonly version = '1.0.28';
  private readonly storageKey = `release_notes_${this.version}`;

  private readonly notes = [
    'Implement notification',
    'Fixed issue with some liked songs not working correctly',
    'Fixed auto next play issue',
    'Fixed queue problem'
  ];

  constructor() { }

  shouldShowReleaseNotes(): boolean {
    return !localStorage.getItem(this.storageKey);
  }

  markReleaseNotesAsSeen(): void {
    localStorage.setItem(this.storageKey, 'true');
  }

  getReleaseNotes(): { version: string, notes: string[] } {
    return {
      version: this.version,
      notes: this.notes
    };
  }
}
