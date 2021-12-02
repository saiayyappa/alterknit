import { AddressInfo, DataService, FormSteps, Garment, StateCodes, PostalCodes } from 'src/app/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {

  garments: Garment[] = [];
  shippingAddressInfo!: AddressInfo;
  billingAddressInfo!: AddressInfo;
  submitted = false;
  step = FormSteps[3];
  showCompanyField = false;
  stateCodes = StateCodes;

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    companyName: [''],
    city: ['', Validators.required],
    state: ['', [Validators.required, Validators.min(1)]],
    zipcode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    isBillingAddressSame: [false]
  });

  billingAddressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', [Validators.required, Validators.min(1)]],
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
        this.showCompanyField = (order.addressInfo.companyName && order.addressInfo.companyName.length > 0) ? true : false;
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
    if (!this.validateZipcode(this.addressForm.getRawValue().state, this.addressForm.getRawValue().zipcode)) {
      this.addressForm.controls['zipcode'].setErrors({'incorrect': true});
    }
    if (!this.validateZipcode(this.billingAddressForm.getRawValue().state, this.billingAddressForm.getRawValue().zipcode)) {
      this.billingAddressForm.controls['zipcode'].setErrors({'incorrect': true});
    }
    console.log(this.validateZipcode(this.billingAddressForm.getRawValue().state, this.billingAddressForm.getRawValue().zipcode));
    console.log(this.billingAddressForm.controls['zipcode'].valid, "billingAddressForm");
    if (!this.addressForm.controls['zipcode'].valid) {
      return;
    }
    if (this.addressForm.invalid) {
      return;
    }
    if (!this.addressForm.value.isBillingAddressSame) {
      if (!this.billingAddressForm.controls['zipcode'].valid) {
        return;
      }
      if (this.billingAddressForm.invalid) {
        return;
      }
    }
    this.shippingAddressInfo = { ...this.addressForm.value };
    this.billingAddressInfo = { ...this.billingAddressForm.value };
    this.dataService.addOrUpdateAddressInfo(this.shippingAddressInfo, this.billingAddressInfo);
    this.router.navigate(['orders/review']);
  }

  getEnumKeyByEnumValue(enumValue: FormControl) {
      let values = Object.values(StateCodes).filter(x => x == enumValue.value);
      return values.length > 0 ? values[0] : null;
  }
  validateZipcode(state: string, zipcode: string) {
    if (zipcode.length == 0) {
      return false;
    }
    for(let i in PostalCodes) {
      if (Object.keys(PostalCodes[i]).find(p => p === state)) {
        var possibleCodes = Object.values(PostalCodes[i])[0]?.split(',');
        return possibleCodes?.indexOf(zipcode) !== -1;
      }
    }
    return false;
  }
}
