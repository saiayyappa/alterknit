import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {

  headerThemes = HeaderTheme;
  showTerms: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
