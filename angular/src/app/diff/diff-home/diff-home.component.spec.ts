import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffHomeComponent } from './diff-home.component';

describe('DiffHomeComponent', () => {
  let component: DiffHomeComponent;
  let fixture: ComponentFixture<DiffHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
