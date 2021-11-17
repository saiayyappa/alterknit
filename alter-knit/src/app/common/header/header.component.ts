import { Component, Input, OnInit } from '@angular/core';

import { HeaderTheme } from '../interfaces/header-theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() theme: string = HeaderTheme.WHITE;
  headerThemes = HeaderTheme;
  constructor() { }

  ngOnInit(): void {
  }

}
