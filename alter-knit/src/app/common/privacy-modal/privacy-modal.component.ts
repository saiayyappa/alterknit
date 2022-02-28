import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.css']
})
export class PrivacyModalComponent implements OnInit {

  @Input() open: boolean = false;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
