import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { HeaderTheme } from 'src/app/common/interfaces/header-theme';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  headerThemes = HeaderTheme;
  submitted = false;
  signUpSubmitted = false;
  signInForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  signUpForm = this.fb.group({
    name: ['', Validators.required],
    emailAddress: ['', Validators.required],
    password: ['', Validators.required],
  });
  showPassword = false;
  get form() { return this.signInForm.controls; }
  get form2() { return this.signUpForm.controls; }
  showSignUpForm = false;
  showErrorMessage = false;
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe((user) => {
      if(user){
        this.router.navigate(['/orders']);
      }
    })
  }

  googleSignIn() {
    this.auth.signInWithGoogle();
    this.auth.setAsSignedInAndCurrentUser();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    this.submitted = true;
    this.loading = true;
    console.log(this.signInForm.value);
    const response: any = await this.auth.signIn(this.signInForm.value.username, this.signInForm.value.password);
    if (response) {
      this.router.navigate(['/orders']);
      this.auth.setAsSignedInAndCurrentUser();
    } else {
      console.log("NotAuthorizedException")
      this.showErrorMessage = true;
      this.errorMessage = 'Username/Password is wrong';
    }
    this.loading = false;
  }

  async signUp() {
    this.signUpSubmitted = true;
    console.log(this.signUpForm.value);
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.invalid) {
      return;
    }
    this.loading = true;
    const response: any = await this.auth.signUp(this.signUpForm.value.name, this.signUpForm.value.emailAddress, this.signUpForm.value.password);
    if (response && !response.Session) {
      console.log("User Created Successfully");
      this.showErrorMessage = true;
      this.errorMessage = "User Created Successfully. Verify the user using the verification email you received in your mail.";
    }
    if (response && response.code === 'UsernameExistsException') {
      console.log("An account with the given email already exists.")
      this.showErrorMessage = true;
      this.errorMessage = 'An account with the given email already exists.';
    }
    this.loading = false;
  }
}
