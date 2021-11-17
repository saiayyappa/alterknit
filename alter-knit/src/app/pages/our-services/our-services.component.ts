import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.css']
})
export class OurServicesComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor() { }

  ngOnInit(): void {
  }

}
