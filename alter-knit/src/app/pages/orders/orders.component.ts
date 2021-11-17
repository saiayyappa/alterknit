import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor() { }

  ngOnInit(): void {
  }

}
