import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyAlterknitComponent } from './why-alterknit.component';

describe('WhyAlterknitComponent', () => {
  let component: WhyAlterknitComponent;
  let fixture: ComponentFixture<WhyAlterknitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyAlterknitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyAlterknitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
