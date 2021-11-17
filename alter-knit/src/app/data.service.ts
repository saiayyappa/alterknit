import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum OrderMethod {
  Ship,
  Pickup,
  Dropoff
}

export enum DeliverySpeed {
  rush,
  standard
}

export enum ActionType {
  ADD,
  EDIT
}

export interface Garment {
  serviceNeeded: Service[];
  brand: string;
  color: string;
  ageOfGarment: number;
  noOfHoles: number;
  briefDescription: string;
  isDryCleaned: boolean;
  isCleaned: boolean;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  email: string;
  isBillingAddress: boolean;
}
export interface PickUpInfo {
  firstName: string;
  lastName: string;
  buildingType: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  email: string;
  pickUpDate: string;
  pickUpTime: string;
  isBillingAddress: boolean;
}

export interface Service {
  name: string,
  checked: boolean
}

export function ServiceList() {
  return [
    {
      name: 'Reknitting of holes on your sweaters, hats, gloves, scarves, blanket, exc...',
      checked: false
    },
    {
      name: 'Reweaving for suits, blazers, slacks, overcoat, exc...',
      checked: false
    },
    {
      name: 'Reknitting of',
      checked: false
    },
    {
      name: 'Knit Alteration',
      checked: false
    },
    {
      name: 'Knit Restyling',
      checked: false
    },
    {
      name: 'Depilling',
      checked: false
    },
    {
      name: 'Cleaning',
      checked: false
    },
    {
      name: 'Custom Knit Work',
      checked: false
    },
    {
      name: 'Other Fabric Repair',
      checked: false
    },
  ]
};

export const BuildingTypes = [
  'Manhatten Doorman Building (Residential)',
  'Manhatten Non-Doorman Building (Residential)',
  'Manhatten Office Building'
];

export class Order {
  orderMethod = OrderMethod.Ship;
  garments: Garment[] = [];
  addressInfo!: ShippingInfo | PickUpInfo;
  deliverySpeed = DeliverySpeed.rush;
  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // order = new Order();
  order: Order = {
    "orderMethod": 1,
    "garments": [
      {
        "serviceNeeded": [
          {
            "name": "Reknitting of holes on your sweaters, hats, gloves, scarves, blanket, exc...",
            "checked": false
          },
          {
            "name": "Reweaving for suits, blazers, slacks, overcoat, exc...",
            "checked": false
          },
          {
            "name": "Reknitting of",
            "checked": false
          },
          {
            "name": "Knit Alteration",
            "checked": false
          },
          {
            "name": "Knit Restyling",
            "checked": true
          },
          {
            "name": "Depilling",
            "checked": false
          },
          {
            "name": "Cleaning",
            "checked": false
          },
          {
            "name": "Custom Knit Work",
            "checked": true
          },
          {
            "name": "Other Fabric Repair",
            "checked": false
          }
        ],
        "isDryCleaned": false,
        "isCleaned": false,
        "brand": "J Crew",
        "color": "red",
        "ageOfGarment": 1,
        "noOfHoles": 1,
        "briefDescription": "This is a red color j crew sweater."
      },
      {
        "serviceNeeded": [
          {
            "name": "Reknitting of holes on your sweaters, hats, gloves, scarves, blanket, exc...",
            "checked": false
          },
          {
            "name": "Reweaving for suits, blazers, slacks, overcoat, exc...",
            "checked": false
          },
          {
            "name": "Reknitting of",
            "checked": false
          },
          {
            "name": "Knit Alteration",
            "checked": false
          },
          {
            "name": "Knit Restyling",
            "checked": false
          },
          {
            "name": "Depilling",
            "checked": false
          },
          {
            "name": "Cleaning",
            "checked": true
          },
          {
            "name": "Custom Knit Work",
            "checked": false
          },
          {
            "name": "Other Fabric Repair",
            "checked": true
          }
        ],
        "isDryCleaned": false,
        "isCleaned": false,
        "brand": "Gucci",
        "color": "pink",
        "ageOfGarment": 1,
        "noOfHoles": 1,
        "briefDescription": "This is a pink color sweater from gucci."
      }
    ],
    "addressInfo": {
      firstName: 'Sai',
      lastName: 'Ayyappa',
      buildingType: 1,
      address: 'alsdkflasdkf lasdjlfkjasdf asdf',
      city: 'Madurai',
      state: 'TN',
      zipcode: '625012',
      phone: '9999999999',
      email: 'saiayyappaor@gmail.com',
      pickUpDate: '',
      pickUpTime: '',
      isBillingAddress: false
    },
    "deliverySpeed": 0
  }
  orderSubject = new BehaviorSubject(this.order);
  constructor() { }

  addGarment(garment: Garment) {
    this.order.garments.push(garment);
    this.orderSubject.next(this.order);
  }

  updateGarment(garment: Garment, index: number) {
    this.order.garments[index] = garment;
    this.orderSubject.next(this.order);
  }

  removeGarment(index: number) {
    this.order.garments.splice(index, 1);
    this.orderSubject.next(this.order);
  }

  changeOrderMethod(orderMethod: OrderMethod) {
    this.order.orderMethod = orderMethod;
    this.orderSubject.next(this.order);
  }

  addOrUpdateAddressInfo(addressInfo: ShippingInfo) {
    this.order.addressInfo = addressInfo;
    console.log('addOrUpdateAddressInfo', this.order);
    this.orderSubject.next(this.order);
  }

}
