import { Component, OnInit } from '@angular/core';
import { DataService, FormSteps, OrderMethod } from 'src/app/data.service';
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
  step = FormSteps[2];
  orderMethods = OrderMethod;
  orderMethod = this.orderMethods.Ship;

  ngOnInit(): void {
  }

  submit() {
    this.dataService.changeOrderMethod(this.orderMethod);
    console.log('Shipment Method ', this.dataService.order)
    if (this.dataService.order.orderMethod === OrderMethod.Ship) {
      this.router.navigate(['orders/shipping']);
    } else if (this.dataService.order.orderMethod === OrderMethod.Pickup) {
      this.router.navigate(['orders/pick-up']);
    }
  }

}
