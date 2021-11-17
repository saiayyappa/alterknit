import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-why-alterknit',
  templateUrl: './why-alterknit.component.html',
  styleUrls: ['./why-alterknit.component.css']
})
export class WhyAlterknitComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor() { }

  ngOnInit(): void {
  }

}
