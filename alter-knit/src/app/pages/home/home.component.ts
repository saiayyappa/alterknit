import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor() { }

  async ngOnInit() {
    // console.log(await Auth.currentAuthenticatedUser());
  }

}
