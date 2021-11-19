import { Component, Input, OnInit } from '@angular/core';

import { FormSteps } from 'src/app/data.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  formSteps = FormSteps;

  @Input() activeStep!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
