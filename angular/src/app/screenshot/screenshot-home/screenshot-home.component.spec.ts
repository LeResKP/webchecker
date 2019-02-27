import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotHomeComponent } from './screenshot-home.component';

describe('ScreenshotHomeComponent', () => {
  let component: ScreenshotHomeComponent;
  let fixture: ComponentFixture<ScreenshotHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenshotHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenshotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
