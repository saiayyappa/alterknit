import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataService, FormSteps, OrderMethod } from 'src/app/data.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit, OnChanges {

  formSteps = FormSteps;
  orderMethods = OrderMethod;

  @Input() activeStep!: string;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) { }

  ngOnChanges(): void {

  }

  ngOnInit(): void {
    this.dataService.orderSubject.subscribe(order => {
      // if (order) {
      //   this.navigateToStep(1);
      // }
    });
  }



  navigateToStep(idx: Number) {
    switch (idx) {
      case 0:
        console.log('step1');
        this.router.navigate(['sign-in']);
        break;
      case 1:
        console.log('step2');
        this.router.navigate(['orders']);
        break;
      case 2:
        console.log('step3');
        this.router.navigate(['orders/select-service']);
        break;
      case 3:
        console.log('step4');
        this.dataService.orderSubject.subscribe((order) => {
          console.log(order.orderMethod === this.orderMethods.Pickup)
          if (order.orderMethod === this.orderMethods.Pickup) {
            this.router.navigate(['orders/pick-up']);
          } else {
            this.router.navigate(['orders/shipping']);
          }
        });
        break;
      case 4:
        console.log('step5');
        this.router.navigate(['orders/review']);
        break;

      default:
        break;
    }
  }
}
