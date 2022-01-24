import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { HeaderTheme } from 'src/app/common/interfaces/header-theme';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router) { }

  headerThemes = HeaderTheme;
  submitted = false;
  signInForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  showPassword = false;
  get form() { return this.signInForm.controls; }

  ngOnInit(): void {
  }

  googleSignIn() {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    this.submitted = true;
    console.log(this.signInForm.value);
    try {
      const user = await Auth.signIn(this.signInForm.value.username, this.signInForm.value.password);
      console.log(user);
      this.router.navigate(['/orders'])
    } catch (error) {
      console.log('error signing in', error);
    }
  }
}
