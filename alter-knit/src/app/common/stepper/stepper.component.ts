import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DataService, FormSteps, Order, OrderMethod } from 'src/app/data.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit, OnChanges {

  formSteps = FormSteps;
  orderMethods = OrderMethod;
  order!: Order;

  @Input() activeStep!: string;
  // @Output() nextRoute = new EventEmitter();

  constructor(
    private router: Router,
    private dataService: DataService,
  ) { }

  ngOnChanges(): void {

  }

  ngOnInit(): void {
    this.dataService.orderSubject.subscribe(order => {
      this.order = order;
      //   this.navigateToStep(1);
    });
  }


  navigateToStep(idx: Number) {
    console.log( this.formSteps.indexOf(this.activeStep)> idx, this.formSteps.indexOf(this.activeStep) , idx);
    if(this.formSteps.indexOf(this.activeStep) > idx){
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
          if (this.order.orderMethod === this.orderMethods.Pickup) {
            console.log('step4 - 1');
            this.router.navigate(['orders/pick-up']);
          } else {
            console.log('step4 - 2');
            this.router.navigate(['orders/shipping']);
          }
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
}
