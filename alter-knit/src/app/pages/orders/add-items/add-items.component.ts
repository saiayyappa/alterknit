import { Component, OnInit } from '@angular/core';
interface Garment {
  serviceNeeded: string;
  brand: string;
  color: string;
  ageOfGarment: number;
  noOfHoles: number;
  briefDescription: string;
}
@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})
export class AddItemsComponent implements OnInit {

  constructor() { }

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

  ngOnInit(): void {
  }

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

}
