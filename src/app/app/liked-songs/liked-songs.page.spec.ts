import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikedSongsPage } from './liked-songs.page';

describe('LikedSongsPage', () => {
  let component: LikedSongsPage;
  let fixture: ComponentFixture<LikedSongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
