import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  headerThemes = HeaderTheme;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    await this.authService.setAsSignedInAndCurrentUser();
  }

}
