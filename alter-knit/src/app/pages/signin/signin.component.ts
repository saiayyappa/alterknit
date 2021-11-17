import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor() { }

  headerThemes = HeaderTheme;

  ngOnInit(): void {
  }

}
