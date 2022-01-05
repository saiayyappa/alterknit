import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-garment-tips',
  templateUrl: './garment-tips.component.html',
  styleUrls: ['./garment-tips.component.css']
})
export class GarmentTipsComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor() { }

  ngOnInit(): void {
  }

}
