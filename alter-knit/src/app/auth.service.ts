import { Injectable } from '@angular/core';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  signedInState: boolean = false;
  currentUser = null;

  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  async setAsSignedInAndCurrentUser() {
    this.signedInState = true;
    this.currentUser = await this.getCurrentAuthenticatedUser();
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  setAsSignedOut() {
    this.signedInState = false;
    this.currentUser = null;
    console.log(this.signedInState, this.currentUser)
  }

  signInWithGoogle() {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  }

  async getCurrentAuthenticatedUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('from %o', user);
      this.currentUserSubject.next(user);
      return user;
    } catch (e) {
      return null;
    }
  }

  async signIn(username: string, password: string) {
    try {
      const user = await Auth.signIn(username, password);
      console.log(user);
      return user;
    } catch (error) {
      console.log('error signing in: ', error);
      return error;
    }
  }

  async signUp(username: string, email: string, password: string) {
    try {
      const fullName = username;
      username = email;
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          'custom:fullName': fullName
        }
      });
      console.log(user);
      return user;
    } catch (error) {
      console.log('error signing up:', error);
      return error
    }
  }

  async signOut() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await Auth.signOut();
      console.log('Logged out')
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  // Send confirmation code to user's email
  async forgotPassword(username: string) {
    try {
      const response = await Auth.forgotPassword(username);
      console.log('response', response);
      return response;
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

  // Collect confirmation code and new password, then
  async forgotPasswordSubmit(username: string, code: string, newPassword: string) {
    try {
      const response = await Auth.forgotPasswordSubmit(username, code, newPassword);
      return response;
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

}
