import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  showTerms: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  check() {
    console.log(this.showTerms)
  }

}
