import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum OrderMethod {
  Ship,
  Pickup,
  Dropoff
}

export enum DeliverySpeed {
  rush,
  standard
}

export interface Garment {
  serviceNeeded: string;
  brand: string;
  color: string;
  ageOfGarment: number;
  noOfHoles: number;
  briefDescription: string;
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

export class Order {
  orderMethod = OrderMethod.Ship;
  garments:Garment[] = [];
  shippingInfo!: ShippingInfo;
  deliverySpeed = DeliverySpeed.rush;
  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  order = new Order();
  orderSubject = new BehaviorSubject(this.order);
  constructor() { }

  addGarment(garment: Garment) {
    this.order.garments.push(garment);
    this.orderSubject.next(this.order);
  }

}
