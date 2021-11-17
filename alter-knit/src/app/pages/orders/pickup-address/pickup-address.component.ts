import { BuildingTypes, DataService, Garment, PickUpInfo, Service, ShippingInfo } from 'src/app/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-pickup-address',
  templateUrl: './pickup-address.component.html',
  styleUrls: ['./pickup-address.component.css']
})
export class PickupAddressComponent implements OnInit {

  garments: Garment[] = [];
  pickupAddressInfo!: PickUpInfo;
  submitted = false;
  buildingTypes = BuildingTypes;

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    buildingType: ['0', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    pickUpDate: ['', Validators.required],
    pickUpTime: ['', Validators.required],
    isBillingAddress: [false]
  });
  get form() { return this.addressForm.controls; }

  constructor(
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dataService.orderSubject.subscribe(order => {
      this.garments = order.garments;
      if (order.addressInfo) {
        this.addressForm.setValue(order.addressInfo);
        this.addressForm.controls['buildingType'].setValue((order.addressInfo as PickUpInfo).buildingType.toString());
      }
    });
  }

  getServiceList(serviceList: Service[]): string[] {
    let serviceNames = serviceList.filter(service => service.checked).map(service => service.name);
    return serviceNames;
  }

  submit() {
    this.submitted = true;
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid) {
      return;
    }
    this.pickupAddressInfo = { ...this.addressForm.value };
    this.pickupAddressInfo.buildingType = +this.pickupAddressInfo.buildingType;
    this.dataService.addOrUpdateAddressInfo(this.pickupAddressInfo);
    this.router.navigate(['orders/review']);
  }

}
