import { Component, Input, OnInit } from '@angular/core';
import { Garment, Service } from 'src/app/data.service';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit {

  @Input() garments: Garment[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  getServiceList(serviceList: Service[]): string[] {
    let serviceNames = serviceList.filter(service => service.checked).map(service => service.name);
    return serviceNames;
  }

}
