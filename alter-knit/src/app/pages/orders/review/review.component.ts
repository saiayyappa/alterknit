import { BuildingTypes, DataService, DeliverySpeed, FormSteps, Garment, Order, OrderMethod, Service } from 'src/app/data.service';
import { Component, OnChanges, OnInit } from '@angular/core';

import { HttpApiService } from 'src/app/http-api.service';
import { Router } from '@angular/router';
import { LoaderComponent} from '../../../common/loader/loader.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnChanges {

  order!: Order;
  submitted = false;
  showTerms: boolean = false;
  orderMethods = OrderMethod;
  step = FormSteps[4];
  deliverySpeeds = DeliverySpeed;
  deliverySpeed = DeliverySpeed.Rush;
  checkTerms = false;
  checkTermsError = false;
  loading = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private apiService: HttpApiService,
  ) { }

  ngOnChanges(): void {
    if (this.checkTerms) {
      this.checkTermsError = false;
    }
  }

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
    // console.log(this.showTerms)
  }
  getServiceNames(serviceList: Service[]): string[] {
    let serviceNames = serviceList.filter(service => service.checked).map(service => service.name);
    return serviceNames;
  }
  submitOrder() {
    if (!this.checkTerms) {
      this.checkTermsError = true;
      return;
    }
    this.dataService.updateDeliverySpeed(this.deliverySpeed);
    let payload: any = JSON.parse(JSON.stringify(this.dataService.order));
    // replace enums with strings
    payload.orderMethod = OrderMethod[this.order.orderMethod];
    payload.deliverySpeed = DeliverySpeed[this.order.deliverySpeed];
    payload.addressInfo.buildingType = (this.order.orderMethod === OrderMethod.Pickup) ? BuildingTypes[this.order.addressInfo.buildingType] : '';
    payload.garments = payload.garments.map((garment: any) => {
      garment.serviceNeeded = this.getServiceNames(garment.serviceNeeded);
      return garment;
    });
    // save order
    this.loading = true;
    this.apiService.createOrder(payload).subscribe((res) => {
      console.log('response', res);
      this.loading = false;
      this.dataService.resetOrdersOnComplete();
      this.router.navigate(['thank-you']);
    },err => this.loading = false);
  }

}
