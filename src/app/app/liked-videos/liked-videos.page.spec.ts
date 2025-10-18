import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikedVideosPage } from './liked-videos.page';

describe('LikedVideosPage', () => {
  let component: LikedVideosPage;
  let fixture: ComponentFixture<LikedVideosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedVideosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
