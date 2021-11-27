import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragNDropImageComponent } from './drag-n-drop-image.component';

describe('DragNDropImageComponent', () => {
  let component: DragNDropImageComponent;
  let fixture: ComponentFixture<DragNDropImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragNDropImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragNDropImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
