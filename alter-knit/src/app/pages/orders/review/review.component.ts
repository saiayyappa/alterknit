import { Component, OnInit } from '@angular/core';
import { DataService, Garment, Order, OrderMethod, PickUpInfo, ShippingInfo } from 'src/app/data.service';

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  order!: Order;
  submitted = false;
  showTerms: boolean = false;
  orderMethods = OrderMethod;

  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.dataService.orderSubject.subscribe(order => {
      this.order = order;
      console.log(this.order)
    });
  }
  navigateToAddressinfo() {
    if (this.order.orderMethod === this.orderMethods.Ship) {
      this.router.navigate(['orders/shipping']);
    } else {
      this.router.navigate(['orders/pick-up']);
    }
  }
  check() {
    console.log(this.showTerms)
  }

}
