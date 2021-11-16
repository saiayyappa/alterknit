import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
interface SweaterInfo {
  id: number;
  brand: string;
  material: string;
  customer: string;
  workCompleted: string;
  imagePath: string;
  enlargedImagePath: string;
}
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit, OnChanges {

  @Input() open: boolean = false;
  @Input()
  items!: SweaterInfo[];
  @Input() item!: SweaterInfo;
  @Output() close = new EventEmitter();
  lhide: boolean = false;
  rhide: boolean = false;
  constructor(private cdr: ChangeDetectorRef) { }

  checkFlag(): void {
    console.log('checkFlag')
    if (this.item?.id === 1) {
      this.lhide = true;
    } else {
      this.lhide = false;
    }
    if (this.item?.id === 11) {
      this.rhide = true;
    } else {
      this.rhide = false;
    }
  }

  ngOnInit(): void {
    this.item = this.items.find(x => x.id === (this.item?.id || 1))!;
    this.checkFlag();
    console.log(this.items);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkFlag();
  }

  before() {
    this.cdr.detectChanges();
    this.item = this.items.find(x => x.id === (this.item.id - 1))!;
    this.checkFlag();
  }

  after() {
    this.cdr.detectChanges();
    this.item = this.items.find(x => x.id === (this.item.id + 1))!;
    this.checkFlag();
  }

}
