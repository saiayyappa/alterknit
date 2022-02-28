import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsModalComponent } from './tconditions-modal.component'

describe('ConditionsModalComponent', () => {
  let component: ConditionsModalComponent;
  let fixture: ComponentFixture<ConditionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
