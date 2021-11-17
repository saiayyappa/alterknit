import { ActionType, DataService, Garment, Service, ServiceList } from '../../data.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit, OnChanges {

  @Input() open: boolean = false;
  @Input() action!: ActionType;
  @Output() close = new EventEmitter();
  @Output() addItemFinal = new EventEmitter();
  @Input() item!: Garment;

  submitted: boolean = false;
  serviceList: Service[] = ServiceList();
  selectedServices!: string[];
  garmentForm = this.fb.group({
    brand: ['', Validators.required],
    color: ['', Validators.required],
    ageOfGarment: ['', Validators.required],
    noOfHoles: ['', Validators.required],
    briefDescription: ['', Validators.required],
  });
  get itemf() { return this.garmentForm.controls; }
  showServiceListError: boolean = false;
  isDryCleaned: boolean = false;
  isCleaned: boolean = false;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnChanges(): void {
    if (this.action === ActionType.ADD) {
      this.resetForm();
    } else if (this.action === ActionType.EDIT) {
      this.serviceList = this.item.serviceNeeded;
      this.garmentForm.setValue({
        brand: this.item.brand,
        color: this.item.color,
        ageOfGarment: this.item.ageOfGarment,
        noOfHoles: this.item.noOfHoles,
        briefDescription: this.item.briefDescription,
      });
      this.isDryCleaned = this.item.isDryCleaned;
      this.isCleaned = this.item.isCleaned;
    }
  }

  ngOnInit(): void { }

  resetForm() {
    this.submitted = false;
    this.serviceList = ServiceList();
    this.garmentForm.reset();
  }

  submit() {
    // construct the object and then emit
    this.submitted = true;
    this.showServiceListError = this.serviceList.find(s => s.checked === true) ? false : true;
    if (this.showServiceListError) {
      return;
    }
    this.garmentForm.markAllAsTouched();
    if (this.garmentForm.invalid) {
      return;
    }
    console.log(this.garmentForm);
    let garment: Garment = {
      serviceNeeded: this.serviceList,
      isDryCleaned: false,
      isCleaned: false,
      ...this.garmentForm.value
    };
    if (this.action === ActionType.ADD) {
      this.dataService.addGarment(garment);
    } else if (this.action === ActionType.EDIT) {
      this.addItemFinal.emit(garment);
    }
    console.log('item modal', this.dataService.order);
    this.resetForm();
    this.close.emit();
  }

}
