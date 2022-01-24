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
  billingAddressInfo!: AddressInfo;
  submitted = false;
  buildingTypes = BuildingTypes;
  step = FormSteps[3];
  showCompanyField = false;

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    buildingType: ['0', Validators.required],
    address: ['', [Validators.required, Validators.maxLength(35)]],
    companyName: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    pickUpDate: ['', Validators.required],
    pickUpTime: ['', Validators.required],
    isBillingAddressSame: [false]
  });

  billingAddressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', [Validators.required, Validators.maxLength(35)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
  });

  get form() { return this.addressForm.controls; }
  get billingForm() { return this.billingAddressForm.controls; }

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
        if (!order.addressInfo.isBillingAddressSame && order.billingAddressInfo) {
          this.billingAddressForm.setValue(order.billingAddressInfo);
        } else {
          this.billingAddressForm.reset();
        }
      }
    });
  }

  updateValidatorsAndReset() {
    if (this.showCompanyField) {
      this.addressForm.controls['companyName'].setValidators(Validators.required);
    } else {
      this.addressForm.controls['companyName'].clearValidators();
      this.addressForm.controls['companyName'].reset();
    }
  }

  showBillingAddressControl() {
    return !this.addressForm.value.isBillingAddressSame;
  }

  resetBillingForm() {
    this.billingAddressForm.reset();
  }

  submit() {
    this.submitted = true;
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid) {
      return;
    }
    if (!this.addressForm.value.isBillingAddressSame) {
      if (this.billingAddressForm.invalid) {
        return;
      }
    }
    this.pickupAddressInfo = { ...this.addressForm.value };
    this.pickupAddressInfo.buildingType = (this.pickupAddressInfo.buildingType) ? Number(this.pickupAddressInfo.buildingType) : 0;
    this.billingAddressInfo = { ...this.billingAddressForm.value };
    this.dataService.addOrUpdateAddressInfo(this.pickupAddressInfo, this.billingAddressInfo);
    this.router.navigate(['orders/review']);
  }

}
