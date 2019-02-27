import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationHomeComponent } from './validation-home.component';

describe('ValidationHomeComponent', () => {
  let component: ValidationHomeComponent;
  let fixture: ComponentFixture<ValidationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
