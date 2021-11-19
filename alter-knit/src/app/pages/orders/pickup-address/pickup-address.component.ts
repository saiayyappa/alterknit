import { AddressInfo, BuildingTypes, DataService, FormSteps, Garment } from 'src/app/data.service';
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
  pickupAddressInfo!: AddressInfo;
  submitted = false;
  buildingTypes = BuildingTypes;
  step = FormSteps[3];

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
        this.addressForm.controls['buildingType'].setValue(order?.addressInfo?.buildingType?.toString());
      }
    });
  }

  submit() {
    this.submitted = true;
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid) {
      return;
    }
    this.pickupAddressInfo = { ...this.addressForm.value };
    this.pickupAddressInfo.buildingType = (this.pickupAddressInfo.buildingType) ? Number(this.pickupAddressInfo.buildingType) : 0;
    this.dataService.addOrUpdateAddressInfo(this.pickupAddressInfo);
    this.router.navigate(['orders/review']);
  }

}
