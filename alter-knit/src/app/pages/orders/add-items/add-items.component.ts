import { Component, OnInit } from '@angular/core';
import { DataService, Garment } from '../../../data.service';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})

export class AddItemsComponent implements OnInit {

  garments: Garment[] = [
    {
      serviceNeeded: 'Sweater Repair',
      brand: 'J Crew',
      color: 'red',
      ageOfGarment: 2,
      noOfHoles: 8,
      briefDescription: 'Holes on the rght sleeve. A burn on the left side'
    }
  ];
  modalOpen: boolean = true;
  selectedGarment!: Garment;


  constructor(private dataService: DataService) {
    this.dataService.orderSubject.subscribe(order => {
      this.garments = order.garments;
    });
  }

  ngOnInit(): void { }

  addItem() {
    console.log('addItem');
    this.modalOpen = true;
  }

  editItem() {
    console.log('editItem')
  }

  removeItem() {
    console.log('removeItem')
  }

  checkItem(item: any) {
    console.log(item);
  }

}
