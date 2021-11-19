import { ActionType, DataService, FormSteps, Garment, OrderMethod, Service } from '../../../data.service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})

export class AddItemsComponent implements OnInit {

  garments: Garment[] = [];
  modalOpen: boolean = false;
  selectedGarment!: Garment;
  updateItemIdx!: number;
  actionType: ActionType = ActionType.ADD;
  showNoGarmentError = false;
  step = FormSteps[2];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.orderSubject.subscribe(order => {
      this.garments = order.garments;
      this.showNoGarmentError = !(this.garments.length > 0);
    });
  }

  ngOnInit(): void {
    this.showNoGarmentError = false;
  }
  getServiceNames(serviceList: Service[]): string {
    let serviceNames = serviceList.filter(service => service.checked).map(service => service.name);
    return serviceNames.join(", ");
  }
  addItem() {
    console.log('addItem');
    this.actionType = ActionType.ADD;
    this.modalOpen = true;
  }
  editItem(idx: number) {
    console.log('editItem');
    this.actionType = ActionType.EDIT;
    this.selectedGarment = this.dataService.order.garments[idx];
    this.updateItemIdx = idx;
    this.modalOpen = true;
  }

  removeItem(idx: number) {
    console.log('removeItem');
    this.dataService.removeGarment(idx);
    console.log('removed', this.dataService.order)
  }

  updateGarment(item: Garment) {
    console.log(item, this.updateItemIdx);
    this.dataService.updateGarment(item, this.updateItemIdx);
  }

  proceedToShipping() {
    console.log(this.dataService.order.orderMethod);
    if (this.dataService.order.garments.length === 0) {
      this.showNoGarmentError = true;
      return;
    }
    if (this.dataService.order.orderMethod === OrderMethod.Ship) {
      this.router.navigate(['orders/shipping']);
    } else if (this.dataService.order.orderMethod === OrderMethod.Pickup) {
      this.router.navigate(['orders/pick-up']);
    }
  }

}
