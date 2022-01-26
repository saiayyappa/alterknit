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
  newPasswordSubmitted = false;
  signInForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  signUpForm = this.fb.group({
    name: ['', Validators.required],
    emailAddress: ['', Validators.required],
    password: ['', Validators.required],
  });
  forgotPasswordForm = this.fb.group({
    code: ['', Validators.required],
    newPassword: ['', Validators.required],
  });
  showPassword = false;
  get form() { return this.signInForm.controls; }
  get form2() { return this.signUpForm.controls; }
  get form3() { return this.forgotPasswordForm.controls; }
  showSignUpForm = false;
  showErrorMessage = false;
  showForgotPasswordForm = false;
  errorMessage = '';
  loading = false;
  username = '';
  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe((user) => {
      if (user) {
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
    if (response && response.code === "NotAuthorizedException") {
      this.showErrorMessage = true;
      this.errorMessage = 'Username/Password is wrong';
    } else if (response && response.code === "UserNotConfirmedException") {
      this.showErrorMessage = true;
      this.errorMessage = 'User is not confirmed. Please check your email and verify account.';
    } else {
      this.router.navigate(['/orders']);
      this.auth.setAsSignedInAndCurrentUser();
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

  async forgotPassword() {
    this.username = this.signInForm.value.username;
    if (this.username.length === 0) {
      this.showErrorMessage = true;
      this.errorMessage = 'Please enter username to change password';
      return;
    } else {
      const response = await this.auth.forgotPassword(this.username);
      if (response && response.code === 'InvalidParameterException') {
        this.showErrorMessage = true;
        this.errorMessage = "Cannot reset password for the user as there is no registered/verified email";
        return;
      }
      this.showErrorMessage = true;
      this.showForgotPasswordForm = true;
      this.errorMessage = `Please check your email ${response.CodeDeliveryDetails.Destination} for verification code`;
    }
  }

  async changePassword() {
    this.newPasswordSubmitted = true;
    console.log(this.forgotPasswordForm.value);
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    const response: any = await this.auth.forgotPasswordSubmit(this.username, this.forgotPasswordForm.value.code, this.forgotPasswordForm.value.newPassword);
    console.log(response);
    if (response && response.code === 'CodeMismatchException') {
      this.showErrorMessage = true;
      this.errorMessage = "Invalid verification code provided, please try again.";
    } else if (response && response.code === 'ExpiredCodeException') {
      this.showErrorMessage = true;
      this.errorMessage = "The code is expired, please try again.";
    } else if (response && response.code === 'LimitExceededException') {
      this.showErrorMessage = true;
      this.errorMessage = "Attempt limit exceeded, please try after some time.";
    } else if (response && response === 'SUCCESS') {
      this.clearMessage();
      this.showForgotPasswordForm = false;
    }
    this.loading = false;
  }

  clearMessage() {
    this.showErrorMessage = false;
    this.errorMessage = '';
  }
}
