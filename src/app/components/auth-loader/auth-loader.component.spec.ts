import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthLoaderComponent } from './auth-loader.component';

describe('AuthLoaderComponent', () => {
  let component: AuthLoaderComponent;
  let fixture: ComponentFixture<AuthLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AuthLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
