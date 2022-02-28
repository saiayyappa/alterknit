import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tconditions-modal',
  templateUrl: './tconditions-modal.component.html',
  styleUrls: ['./tconditions-modal.component.css']
})
export class ConditionsModalComponent implements OnInit {

  @Input() open: boolean = false;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
