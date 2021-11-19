import { Component, OnInit } from '@angular/core';
import { DataService, FormSteps, Garment, Order, Service, ShippingInfo } from 'src/app/data.service';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {

  garments: Garment[] = [];
  shippingAddressInfo!: ShippingInfo;
  submitted = false;
  step = FormSteps[3];

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
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
      }
    });
  }

  submit() {
    this.submitted = true;
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid) {
      return;
    }
    this.shippingAddressInfo = { ...this.addressForm.value };
    this.dataService.addOrUpdateAddressInfo(this.shippingAddressInfo);
    this.router.navigate(['orders/review']);
  }
}
