import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum OrderMethod {
  Ship,
  Pickup,
  Dropoff
}

export const FormSteps = [
  'Account',
  'Shipment method',
  'Select Service',
  'Billing/Shipping',
  'Review'
];

export enum DeliverySpeed {
  Rush,
  Standard
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

export interface AddressInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  email: string;
  isBillingAddress: boolean;
  buildingType: number;
  pickUpDate: string;
  pickUpTime: string;
};

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
  addressInfo!: AddressInfo;
  deliverySpeed = DeliverySpeed.Rush;
  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // order = new Order();
  addressInfo = {
    "firstName": "Saiayyappa",
    "lastName": "O R",
    "buildingType": 0,
    "address": "19/6G, JeyasriRamesh Illam, Kamarajar 3rd street",
    "city": "Madurai",
    "state": "Tamil Nadu",
    "zipcode": "625012",
    "phone": "+918526108714",
    "email": "saiayyappa1996@gmail.com",
    "pickUpDate": "",
    "pickUpTime": "",
    "isBillingAddress": false
  };
  order = {
    "orderMethod": 0,
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
            "checked": true
          },
          {
            "name": "Knit Restyling",
            "checked": true
          },
          {
            "name": "Depilling",
            "checked": true
          },
          {
            "name": "Cleaning",
            "checked": false
          },
          {
            "name": "Custom Knit Work",
            "checked": false
          },
          {
            "name": "Other Fabric Repair",
            "checked": false
          }
        ],
        "isDryCleaned": false,
        "isCleaned": false,
        "brand": "J Balvin",
        "color": "Grey",
        "ageOfGarment": 3,
        "noOfHoles": 9,
        "briefDescription": "This is a J Balvin Grey Sweater from my grandmother."
      }
    ],
    "deliverySpeed": 0,
    "addressInfo": this.addressInfo
  };
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

  addOrUpdateAddressInfo(addressInfo: AddressInfo) {
    this.order.addressInfo = addressInfo;
    console.log('addOrUpdateAddressInfo', this.order);
    this.orderSubject.next(this.order);
  }

  updateDeliverySpeed(deliverySpeed: DeliverySpeed) {
    this.order.deliverySpeed = deliverySpeed;
    this.orderSubject.next(this.order);
  }

  resetOrdersOnComplete() {
    this.order = new Order();
    this.orderSubject.next(this.order);
  }

}
