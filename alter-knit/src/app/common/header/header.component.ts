import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

import { HeaderTheme } from '../interfaces/header-theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() theme: string = HeaderTheme.WHITE;
  headerThemes = HeaderTheme;
  user = null;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((user) => {
      this.user = user;
    });
    // this.user = this.authService.currentUser;
  }

  async logout() {
    await this.authService.signOut();
    this.authService.setAsSignedOut();
    console.log('Logged out Successfully');
  }
}
