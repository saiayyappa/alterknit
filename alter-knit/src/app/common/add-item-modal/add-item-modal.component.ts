import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService, Garment } from '../../data.service';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit {

  @Input() open: boolean = false;
  @Output() close = new EventEmitter();
  @Output() addItemFinal = new EventEmitter();
  @Input() item!: Garment;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  submit() {
    // construct the object and then emit
    // TODO
    this.addItemFinal.emit({});
    this.close.emit();
  }

}
