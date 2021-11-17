import { Component, OnInit } from '@angular/core';
import { DataService, OrderMethod } from 'src/app/data.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-shipment-method',
  templateUrl: './shipment-method.component.html',
  styleUrls: ['./shipment-method.component.css']
})
export class ShipmentMethodComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.orderSubject.subscribe(order => {
      this.orderMethod = order.orderMethod;
    });
  }

  orderMethods = OrderMethod;
  orderMethod = this.orderMethods.Ship;

  ngOnInit(): void {
  }

  submit() {
    this.dataService.changeOrderMethod(this.orderMethod);
    console.log('Shipment Method ', this.dataService.order)
    this.router.navigate(['orders/select-service']);
  }

}
