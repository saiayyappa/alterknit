import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'alter-knit';

  constructor(private auth: AuthService) {
    this.auth.getCurrentAuthenticatedUser();
  }

}
