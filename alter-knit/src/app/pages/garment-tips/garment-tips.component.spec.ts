import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentTipsComponent } from './garment-tips.component';

describe('GarmentTipsComponent', () => {
  let component: GarmentTipsComponent;
  let fixture: ComponentFixture<GarmentTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarmentTipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarmentTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
